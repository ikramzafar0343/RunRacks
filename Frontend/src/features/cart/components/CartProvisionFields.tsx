/**
 * OS, app, hostname, and access fields on the cart configure card.
 */
import { HiMagnifyingGlass } from "react-icons/hi2";
import {
  cartAppIcon,
  cartOsIcon,
} from "@/features/cart/components/cartProvisionIcons";
import type { CartConfigureReady } from "@/features/cart/components/useCartConfigure";

export function CartProvisionFields({ cart }: { cart: CartConfigureReady }) {
  const { line, selectedOs } = cart;
  return (
    <>
      <div className="cartOsHead">
        <h3>Operating system or app</h3>
        <p className="cartOsSelected">
          Selected:{" "}
          {selectedOs ? (
            <span className="cartOsSelectedMark">
              <span aria-hidden>{cartOsIcon(selectedOs.id, 14)}</span>
              {cart.selectedLabel}
            </span>
          ) : (
            cart.selectedLabel
          )}
        </p>
      </div>

      <div className="cartSearchWrap">
        <HiMagnifyingGlass size={14} aria-hidden />
        <input
          className="cartSearch"
          type="search"
          placeholder="Search OS or apps"
          value={cart.query}
          onChange={(event) => cart.setQuery(event.target.value)}
          aria-label="Search OS or apps"
        />
      </div>

      <p className="cartGroupLabel">Operating systems</p>
      <ul className="cartOsGrid">
        {cart.osList.map((os) => (
          <li key={os.id}>
            <button
              type="button"
              className="cartChoice cartOsChoice"
              data-active={line.osId === os.id ? "true" : "false"}
              onClick={() => cart.onSelectOs(os.id)}
            >
              <span className="cartOsLogo" aria-hidden>
                {cartOsIcon(os.id, 22)}
              </span>
              <span>
                <span className="cartChoiceName">{os.name}</span>
                <span className="cartChoiceMeta">
                  {os.versionCount} version
                  {os.versionCount === 1 ? "" : "s"}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {selectedOs && selectedOs.versions.length > 0 ? (
        <>
          <p className="cartFieldLabel">{selectedOs.name} versions</p>
          <div className="cartVersions" role="group">
            {selectedOs.versions.map((version) => (
              <button
                key={version}
                type="button"
                className="cartVersionBtn"
                data-active={line.osVersion === version ? "true" : "false"}
                onClick={() => cart.updateLine({ osVersion: version })}
              >
                {version}
              </button>
            ))}
          </div>
        </>
      ) : null}

      <p className="cartGroupLabel">Apps</p>
      <ul className="cartAppGrid">
        {cart.appList.map((app) => (
          <li key={app.id}>
            <button
              type="button"
              className="cartChoice cartAppChoice"
              data-active={line.appId === app.id ? "true" : "false"}
              onClick={() =>
                cart.updateLine({
                  appId: line.appId === app.id ? null : app.id,
                })
              }
            >
              <span className="cartAppLogo" aria-hidden>
                {cartAppIcon(app.id, 18)}
              </span>
              <span>
                <span className="cartChoiceName">{app.name}</span>
                <span className="cartChoiceMeta">{app.blurb}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="cartCreds">
        <div>
          <label className="cartFieldLabel" htmlFor="cart-hostname">
            Host name (required)
          </label>
          <input
            id="cart-hostname"
            className="cartInput"
            value={line.hostname}
            placeholder="web01.example.com"
            onChange={(event) =>
              cart.updateLine({ hostname: event.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="cartFieldLabel" htmlFor="cart-ssh">
            {cart.isLinux
              ? "SSH public key (optional)"
              : "Access note (optional)"}
          </label>
          <textarea
            id="cart-ssh"
            className="cartTextarea"
            value={line.sshKey}
            placeholder={
              cart.isLinux ? "ssh-ed25519 AAAA..." : "Optional notes for setup"
            }
            onChange={(event) =>
              cart.updateLine({ sshKey: event.target.value })
            }
          />
          <p className="cartHelper">{cart.sshHelper}</p>
        </div>
      </div>
    </>
  );
}
