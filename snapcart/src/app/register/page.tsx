"use client"
import RegisterFrom from '@/components/RegisterFrom'

import React, { useState } from 'react'

function Register() {
  const [step, setStep]=useState(1)
  return (
    <div>
      {<RegisterFrom previousStep={setStep}/>}
      
    </div>
  )
}

export default Register
