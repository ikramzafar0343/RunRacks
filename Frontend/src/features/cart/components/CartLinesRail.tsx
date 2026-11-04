/**
 * Multi-line cart picker — select which server to configure.
 */
import type { CartConfigureReady } from "@/features/cart/components/useCartConfigure";

type CartLinesRailProps = {
  cart: CartConfigureReady;
  onClearAll: () => void;
};

export function CartLinesRail({ cart, onClearAll }: CartLinesRailProps) {
  if (cart.lineSummaries.length < 2) return null;

  return (
    <div className="cartLinesRail" role="list" aria-label="Servers in cart">
      {cart.lineSummaries.map((row, index) => {
        const active = row.id === cart.activeLineId;
        return (
          <button
            key={row.id}
            type="button"
            role="listitem"
            className="cartLineChip"
            data-active={active ? "true" : "false"}
            onClick={() => cart.setActiveLineId(row.id)}
          >
            <span className="cartLineChipIndex" aria-hidden>
              {index + 1}
            </span>
            <span className="cartLineChipMeta">
              <span className="cartLineChipName">{row.name}</span>
              <span className="cartLineChipSub">
                {row.familyLabel} · {row.amountLabel}/mo
              </span>
            </span>
          </button>
        );
      })}
      <button
        type="button"
        className="cartLinkBtn cartLinkBtnDanger"
        onClick={onClearAll}
      >
        Clear all
      </button>
    </div>
  );
}
