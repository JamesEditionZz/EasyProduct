import React from 'react'
import Product_group from './Product_group'

function page({ onSelected }) {
  return (
    <div><Product_group onSelected={onSelected} /></div>
  )
}

export default page