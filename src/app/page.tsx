import Image from 'next/image'


import "./page.css"

export default function Home() {
  return (
    <div className="app">
      <div className="sidebar">
        <div className="logo">
          <Image
            src="/logo-cmm.png"
            alt="Logo Cercle des mycologues de Montréal"
            width={200}
            height={140}
          />
        </div>
        <div className="preamble">
          <p>Préambule</p>
        </div>
        <div className="letter"></div>
      </div>
      <div className="content"></div>
    </div>
  )
}
