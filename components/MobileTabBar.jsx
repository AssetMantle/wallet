import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { NavBarData } from "../data";

// Bottom tab bar for < xl viewports (phone + tablet). The desktop top nav in
// Header.js stays for xl+. Five primary destinations sit on the bar; the rest
// of NavBarData.navs (plus the external links) live in a "More" sheet so every
// section stays reachable on a phone.
const PRIMARY_HREFS = ["/", "/stake", "/vote", "/bridge"];

function isActive(router, href) {
  return router.asPath === href || router.asPath.split("?")[0] === href;
}

function TabLink({ item, active }) {
  return (
    <Link href={item.href}>
      <a
        target={item.target || "_self"}
        aria-current={active ? "page" : undefined}
        className={`d-flex flex-column align-items-center justify-content-center gap-1 flex-fill text-white am-tab ${
          active ? "active text-primary" : ""
        }`}
      >
        <span className="h4 m-0 icon d-flex">{item.icon}</span>
        <span className="caption2">{item.title || "Help"}</span>
      </a>
    </Link>
  );
}

export default function MobileTabBar() {
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  const primary = PRIMARY_HREFS.map((href) =>
    NavBarData.navs.find((n) => n.href === href)
  ).filter(Boolean);
  const overflow = [
    ...NavBarData.navs.filter((n) => !PRIMARY_HREFS.includes(n.href)),
    ...NavBarData.rightNav,
  ];
  const moreActive = overflow.some(
    (n) => !n.target && isActive(router, n.href)
  );

  return (
    <>
      {moreOpen && (
        <div
          className="d-flex d-xl-none position-fixed top-0 start-0 end-0 bottom-0 am-tab-scrim"
          style={{ zIndex: 1040 }}
          role="button"
          aria-label="Close menu"
          onClick={() => setMoreOpen(false)}
        />
      )}
      <div
        className={`d-flex d-xl-none flex-column position-fixed start-0 end-0 nav-bg am-tab-sheet ${
          moreOpen ? "open" : ""
        }`}
        style={{ zIndex: 1041 }}
        role="dialog"
        aria-label="More sections"
        aria-hidden={!moreOpen}
      >
        <div className="d-flex align-items-center justify-content-between p-3 pb-2">
          <h2 className="body2 text-white m-0">More</h2>
          <button
            className="text-white h4 m-0 lh-1"
            aria-label="Close"
            onClick={() => setMoreOpen(false)}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="d-flex flex-column pb-3">
          {overflow.map((item, i) => (
            <Link href={item.href} key={i}>
              <a
                target={item.target || "_self"}
                onClick={() => setMoreOpen(false)}
                className={`d-flex align-items-center gap-3 px-4 py-3 text-white am-tab-row ${
                  !item.target && isActive(router, item.href)
                    ? "active text-primary"
                    : ""
                }`}
              >
                <span className="h4 m-0 icon d-flex">{item.icon}</span>
                <span className="body2">{item.title || "Help"}</span>
                {item.endIcon && (
                  <span className="ms-auto icon d-flex">{item.endIcon}</span>
                )}
              </a>
            </Link>
          ))}
        </div>
      </div>

      <nav
        className="d-flex d-xl-none position-fixed start-0 end-0 bottom-0 nav-bg am-tab-bar"
        style={{ zIndex: 1042 }}
        aria-label="Primary"
      >
        {primary.map((item) => (
          <TabLink
            key={item.href}
            item={item}
            active={isActive(router, item.href)}
          />
        ))}
        <button
          className={`d-flex flex-column align-items-center justify-content-center gap-1 flex-fill text-white am-tab bg-transparent ${
            moreOpen || moreActive ? "active text-primary" : ""
          }`}
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen((v) => !v)}
        >
          <span className="h4 m-0 icon d-flex">
            <i className="bi bi-grid" />
          </span>
          <span className="caption2">More</span>
        </button>
      </nav>
    </>
  );
}
