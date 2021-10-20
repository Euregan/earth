import Earth from '../components/Earth'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()

  return <Earth />
}

export default Home
