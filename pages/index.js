import Earth from '../components/Earth'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()
  const { dotCount = 10000 } = router.query

  return <Earth dotCount={dotCount} />
}

export default Home
