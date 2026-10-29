/**
 * Six open numbered working principles.
 */
import { VPS_PRODUCT } from "@/features/vps-product/model/vpsProductContent";
import "@/features/vps-product/components/vps-principles.css";

export function VpsPrinciples() {
  return (
    <section
      className="vpsPrinciples"
      id="vps-principles"
      aria-labelledby="vps-principles-label"
    >
      <div className="vpsPrinciplesInner">
        <h2 id="vps-principles-label" className="vpsPrinciplesLabel">
          {VPS_PRODUCT.principlesLabel}
        </h2>
        <ol className="vpsPrinciplesGrid">
          {VPS_PRODUCT.principles.map((item) => (
            <li key={item.id}>
              <p className="vpsPrincipleNumber">
                <span className="sr-only">Principle {item.number}. </span>
                <span aria-hidden="true">
                  {item.number}
                  <span>.</span>
                </span>
              </p>
              <h3 className="vpsPrincipleTitle">{item.title}</h3>
              <p className="vpsPrincipleBody">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
