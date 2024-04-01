import "./mailList.css"

const MailList = () => {
  return (
    <div className="mail">
      <h1 className="mailTitle">¡Proyecto final Academlo!</h1>
      <span className="mailDesc">Regístrate y te enviaremos las mejores ofertas</span>
      <div className="mailInputContainer">
        <input type="text" placeholder="Tu email" />
        <button>Suscribirme (NO FUNCIONAL)</button>
      </div>
    </div>
  )
}

export default MailList