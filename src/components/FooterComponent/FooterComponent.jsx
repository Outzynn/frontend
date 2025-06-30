
export default function FooterComponent(){
    const anioActual = new Date().getFullYear();

    return(
        <footer>
            <h1 className="NombresFooter">
                San Pedro Agustin - Alfonso Marianela
            </h1>
            <h2 className="AnioFooter">
                {anioActual}
            </h2>
        </footer>
    );
}asd