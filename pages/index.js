import Earth from '../components/Earth'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()

  return (
    <main>
      <div className="punchline banner">
        The good old planet Earth,
        <br />
        now in 3D
      </div>
      <Earth
        autorotate
        style={{
          position: 'absolute',
          right: '0rem',
          top: '6rem',
          width: '65vw',
          height: '65vw',
        }}
      />
      <div className="description banner">
        <p>
          Use it easily in any React project! Simply run{' '}
          <code>npm install 3d-earth-globe</code>
        </p>
      </div>
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
          clip-path: polygon(0% 0%, 100% 0, 100% 100%, 0 100%);
          overflow: hidden;
        }

        .banner {
          padding: 5rem;
          color: white;
        }

        .punchline {
          background: #01234d;
          background: linear-gradient(90deg, #023f88 0%, #01234d 100%);

          height: 40rem;
          clip-path: polygon(0% 0%, 100% 0, 100% 100%, 0 60%);
          margin-bottom: -20rem;

          font-size: 8.5rem;
        }

        .description {
          padding-top: 12rem;
          font-size: 3rem;

          background: #083e22;
          background: linear-gradient(90deg, #148139 0%, #083e22 100%);
        }
        .description > p {
          width: 40rem;
        }

        .api {
          font-size: 2rem;

          background: #01234d;
          background: linear-gradient(90deg, #023f88 0%, #01234d 100%);
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
