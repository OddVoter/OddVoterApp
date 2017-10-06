import React from 'react'
import Header from 'lib/header/component'
import Footer from 'lib/site/footer/component'

export default ({ children }) => (
  <div id='outer-layout'>
    <Header />
    {children}
    <Footer />
  </div>
)
