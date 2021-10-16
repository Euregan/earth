import { useEffect, useState, useRef } from 'react'
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  CircleGeometry,
  Vector3
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const earthRadius = 600

const generateDots = (dotCount, image, imageContext) => {
  const context = document.createElement('canvas').getContext('2d')
  context.drawImage(image, 0, 0, image.width, image.height)

  const isPointLand = point => {
    const [r, g, b, a] = imageContext.getImageData(
      Math.round(point.x * image.width),
      Math.round(point.y * image.height),
      1,
      1
    ).data

    return a > 0
  }

  const dots = []

  const material = new MeshBasicMaterial({ color: 0xffffff })
  const vector = new Vector3()
  const dotGeometry = new CircleGeometry(2, 5)

  for (let i = dotCount; i > 0; i--) {
    const phi = Math.acos(-1 + (2 * i) / dotCount)
    const theta = Math.sqrt(dotCount * Math.PI) * phi

    vector.setFromSphericalCoords(earthRadius, phi, theta)

    const u =
      0.5 +
      Math.atan2(vector.x / earthRadius, vector.z / earthRadius) / (2 * Math.PI)
    const v = 0.5 - Math.asin(vector.y / earthRadius) / Math.PI

    if (isPointLand({ x: u, y: v })) {
      const dot = new Mesh(dotGeometry, material)
      dot.lookAt(vector)
      dot.position.set(vector.x, vector.y, vector.z)

      dots.push(dot)
    }
  }

  return dots
}

const Earth = ({ dotCount = 10000 }) => {
  const containerRef = useRef()
  const canvasRef = useRef()
  const [world, setWorld] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const world = new Image()
    world.onload = () => setImageLoaded(true)
    world.src = '/world.svg'

    setWorld(world)
  }, [])

  useEffect(() => {
    if (containerRef.current && canvasRef.current && imageLoaded) {
      const scene = new Scene()
      const camera = new PerspectiveCamera(
        45,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        10000
      )

      const renderer = new WebGLRenderer({ antialias: false, alpha: true })
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      )
      containerRef.current.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.update()

      const sphereGeometry = new SphereGeometry(earthRadius - 10, 32, 16)
      const sphereMaterial = new MeshBasicMaterial({ color: 0x024883 })
      const sphere = new Mesh(sphereGeometry, sphereMaterial)
      scene.add(sphere)

      camera.position.z = earthRadius * 3

      const context = canvasRef.current.getContext('2d')
      context.drawImage(world, 0, 0, world.width, world.height)
      const dots = generateDots(dotCount, world, context)
      dots.forEach(dot => scene.add(dot))

      const hasStopped = () => stop

      const animate = function() {
        // Preventing the animation to keep going even if the component has been
        // removed from the DOM
        if (document.body.contains(renderer.domElement)) {
          requestAnimationFrame(animate)
        }

        controls.update()

        renderer.render(scene, camera)
      }

      animate()

      return () => {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [containerRef, canvasRef, imageLoaded])

  return (
    <>
      <div ref={containerRef} style={{ height: '100vh' }}>
        <style jsx>{`
          div {
            background: #01234d;
          }
        `}</style>
      </div>
      <canvas
        ref={canvasRef}
        width={`${world ? world.width : 0}px`}
        height={`${world ? world.height : 0}px`}
        style={{ display: 'none' }}
      />
    </>
  )
}

export default Earth
