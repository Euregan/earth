import { useEffect, useState, useRef } from 'react'
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Mesh,
  MeshStandardMaterial,
  ShaderMaterial,
  SphereGeometry,
  CircleGeometry,
  Vector3,
  Vector2,
  DirectionalLight,
  BackSide,
  AdditiveBlending,
  Color
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import atmosphereFragementShader from '../lib/atmosphere.fragment.glsl'
import atmosphereVertexShader from '../lib/atmosphere.vertex.glsl'

const earthRadius = 600
const dotCount = 60000

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

  const visibleThreshold = '0.999937'
  const invisibleThreshold = '0.99994'
  const material = new ShaderMaterial({
    uniforms: {},
    fragmentShader: `
      void main() {
        gl_FragColor.r = 1.0;
        gl_FragColor.g = 1.0;
        gl_FragColor.b = 1.0;
        gl_FragColor.a = 1.0;

        if (gl_FragCoord.z > ${visibleThreshold}) {
          gl_FragColor.a = 1.0 - (gl_FragCoord.z - ${visibleThreshold}) / (${invisibleThreshold} - ${visibleThreshold});
        }
  		}
    `
  })
  material.transparent = true
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

const Earth = () => {
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

      // Globe
      const sphereGeometry = new SphereGeometry(earthRadius - 10, 64, 64)
      const sphereMaterial = new MeshStandardMaterial({ color: 0x024883 })
      const sphere = new Mesh(sphereGeometry, sphereMaterial)
      scene.add(sphere)

      // Halo
      const invisibleThreshold = '0.99994'
      const visibleThreshold = '0.999946'
      const haloGeometry = new SphereGeometry(earthRadius, 64, 64)
      const haloMaterial = new ShaderMaterial({
        uniforms: {
          haloColor: {
            type: 'c',
            value: new Color(1844322)
          },
          viewVector: {
            type: 'v3',
            value: new Vector3(0, 0, earthRadius)
          }
        },
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragementShader,
        side: BackSide,
        blending: AdditiveBlending
      })
      const halo = new Mesh(haloGeometry, haloMaterial)
      halo.scale.multiplyScalar(1.23)
      halo.rotateX(0.03 * Math.PI)
      halo.rotateY(0.03 * Math.PI)
      scene.add(halo)

      // Lights
      const firstLight = new DirectionalLight(0xffffff, 1.0)
      firstLight.position.set(0, 1, 0.6)
      scene.add(firstLight)
      const secondLight = new DirectionalLight(0xffffff, 1.0)
      secondLight.position.set(-1, 0.6, 0.2)
      scene.add(secondLight)

      camera.position.z = earthRadius * 3

      const context = canvasRef.current.getContext('2d')
      context.drawImage(world, 0, 0, world.width, world.height)
      const dots = generateDots(dotCount, world, context)
      dots.forEach(dot => scene.add(dot))

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
