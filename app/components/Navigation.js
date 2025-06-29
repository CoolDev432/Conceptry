import React from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut,  SignInButton, SignUpButton, SignOutButton} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

const Navigation = () => {
  return (
    <div className='mt-20 bg-black/50 md:w-140 w-100 h-20 p-10 rounded-full flex justify-evenly items-center font-bold'>
        <SignedOut>
          <SignInButton className={`cursor-pointer hover:scale-150  p-3 rounded-full`}/>
          <SignUpButton className={`cursor-pointer hover:scale-150  p-3 rounded-full`}/>
        </SignedOut> 

        <SignedIn>
          <SignOutButton/>
          <Link href={'/dashboard'}>
          <Button variant={`destructive`} className={`cursor-pointer`}>
            Dashboard
          </Button>
          </Link>
        </SignedIn>
    </div>
  )
}

export default Navigation