import Earth from '../components/Earth'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()

  return (
    <main>
      <div className="banner">
        <h1>
          Good old planet Earth,
          <br />
          now in 3D
        </h1>
        <p>
          Use it easily in any React project! Simply run
          <br />
          <code>npm install 3d-earth-globe</code> <br />
          or
          <br />
          <code>yarn add 3d-earth-globe</code>
        </p>
      </div>
      <Earth
        autorotate
        style={{
          position: 'fixed',
          right: '0',
          top: '0',
          width: '100vh',
          height: '100vh',
        }}
      />
      <div className="api banner">
        <h3>API documentation coming soon!</h3>
        <p>
          Follow me on{' '}
          <a href="https://twitter.com/euregan" target="_blank">
            Twitter
          </a>{' '}
          for updates!
        </p>
      </div>
      <style jsx>{`
        main {
          background: linear-gradient(125deg, #16243c 0%, #020a14 100%);
        }

        .banner {
          color: white;
          padding: 5rem;
          box-sizing: border-box;
          // full width minus the planet width plus the padding
          width: calc(100% - 100vh + 5rem);
          height: 100vh;

          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        h1 {
          font-size: 4rem;
        }

        p {
          font-size: 2rem;
        }

        .api {
          font-size: 2rem;
        }

        .api > h3 {
          font-size: 3rem;
          font-weight: normal;
        }
      `}</style>
    </main>
  )
}

export default Home
