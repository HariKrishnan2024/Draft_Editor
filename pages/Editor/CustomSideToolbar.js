import React from "react";
import { HiOutlinePlus } from "react-icons/hi";
import classNames from "../../styles/blog.module.css";

function CustomSideToolbar({ sideBarActions = [], open, setOpen }) {
  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        top: 6,
        left: -60,
        height: "100%",
        alignItems: "flex-end",
      }}
    >
      <div
        style={
          open
            ? { ...styles.sideToolBar, ...styles.openSideToolbar }
            : { ...styles.sideToolBar, ...styles.closeSideToolbar }
        }
      >
        <HiOutlinePlus
          style={{
            fontSize: 20,
            cursor: "pointer",
          }}
          onClick={() => setOpen(!open)}
        />
      </div>
      {open && (
        <div
          style={{
            display: "flex",
            marginLeft: 10,
            gap: 10,
            backgroundColor: "#fff",
            zIndex: 5,
          }}
        >
          {sideBarActions.map((action, index) => (
            <div
              key={index}
              className={classNames.actionBtn}
              style={{
                ...styles.actionBtn,
                cursor: "pointer",
              }}
              onClick={action.onClick}
            >
              {action.icon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  sideToolBar: {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 6,
    zIndex: 1,
    transition: "left 0.2s ease-in-out",
  },
  openSideToolbar: {
    transform: "rotate(45deg)",
    transition: "transform 0.2s ease-in-out",
  },
  closeSideToolbar: {
    transform: "rotate(0deg)",
    transition: "transform 0.2s ease-in-out",
  },
  actionBtn: {
    backgroundColor: "#fff",
    border: "1px solid #1C8A19",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 6,
    zIndex: 10,
    fontSize: 20,
    color: "#1C8A19",
  },
};
export default CustomSideToolbar;
