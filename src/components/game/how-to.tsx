import { Button } from "@/components/ui/button";
import { useGame } from "@/game/store";

export function HowTo() {
  const back = useGame((s) => s.toTitle);
  return (
    <div className="min-h-dvh overflow-y-auto bg-bg px-5 py-[max(1.5rem,env(safe-area-inset-top))] text-fg">
      <div className="mx-auto max-w-lg pb-16">
        <p className="text-xs tracking-[0.22em] text-muted uppercase">Manual de mesa</p>
        <h1 className="mt-2 font-display text-4xl uppercase">Cómo se juega</h1>
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted">
          <p>
            Es Risk clásico con dados, sobre un mundo que se está cayendo. Ganas cuando tu facción
            controla todos los territorios, o cuando el resto queda fuera.
          </p>
          <section>
            <h2 className="font-display text-lg text-fg uppercase">Turno</h2>
            <ol className="mt-2 list-decimal space-y-2 pl-5">
              <li>Refuerza: recibes ejércitos por territorios (mínimo 3) y por continentes completos.</li>
              <li>Ataca: elige un territorio propio con 2+ ejércitos y un vecino enemigo. Tiras hasta 3 dados, el defensor hasta 2. El más alto gana; empate para el defensor.</li>
              <li>Fortifica: un solo movimiento entre territorios conectados que controles.</li>
            </ol>
          </section>
          <section>
            <h2 className="font-display text-lg text-fg uppercase">Cartas</h2>
            <p className="mt-2">
              Si tomas al menos un territorio, robos una carta. Tres iguales o una de cada dan un
              set de refuerzos. Con cinco cartas el canje es obligatorio.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg text-fg uppercase">Día Zero</h2>
            <p className="mt-2">
              Al cerrar cada ronda cae un desastre. Mata ejércitos y deja cicatrices que cambian
              refuerzos y defensa. Si tomas un territorio enemigo con el golpe Día Zero (una vez,
              a partir del día 5), dejas un cráter nuclear.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg text-fg uppercase">Grieta y Voidcrown</h2>
            <p className="mt-2">
              Singularidad, cicatrices y mutaciones pueden abrir una realidad hija. Voidcrown no
              es un modo ni un menú: cuando las grietas bastan, nace como facción enemiga y reclama
              yermos. Hay que vencerlo o se traga el mapa.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg text-fg uppercase">Facciones</h2>
            <p className="mt-2">
              Cada mando tiene doctrina. Ceniza aguanta en cicatrices. Marea vive de la costa.
              Nexo deja guarnición al tomar. Horda crece en el interior. Umbral pierde menos en desastres.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg text-fg uppercase">Crónica</h2>
            <p className="mt-2">
              El libro del HUD no es un menú de lore. Los capítulos se abren con lo que haces:
              conquistas, desastres, grietas. Voidcrown sigue sin elegirse.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg text-fg uppercase">Sondas y biota</h2>
            <p className="mt-2">
              Cada territorio tiene vida: seis ejes (ácido, calor, radiación, presión, social, sintético),
              población y esporas. Sondear lee el genoma. Muestra extrae y deja esporas. Sembrar solo en
              tierra tuya: tu facción empuja un eje. Un desastre no borra el nodo: selecciona quién aguanta
              y, si la población cae a cero, queda tumba y espora. El octaedro sobre el globo es el fenómeno.
              Tócalo: avisa antes de que entres.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg text-fg uppercase">Director</h2>
            <p className="mt-2">
              El Director no recompila el juego. Emite un parche: genoma, espora o doctrina
              (normal, austeridad, rescate). Recuerda hasta 20 partidas. Si pierdes más de lo que ganas,
              la siguiente abre en rescate. Las grietas siguen naciendo del mapa, no de un menú.
            </p>
          </section>
          <p>Arrastra el planeta. El icono de mapa cambia a vista táctica. Toca un nodo para actuar. El punto rojo es el fenómeno: tócalo para el aviso.</p>
        </div>
        <Button className="mt-8 w-full" onClick={back}>
          Volver
        </Button>
      </div>
    </div>
  );
}
