import Image from 'next/image'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className='flexBetween navbar'>
        <div className='flex-1 flexStart gap-10'>
            <Link href="/">
                <Image src="/logo.svg" width={115} height={43} alt="Dribbble" />
            </Link>
        </div>
    </nav>
  )
}

export default Navbar