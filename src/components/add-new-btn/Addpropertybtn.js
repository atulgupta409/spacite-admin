import React from "react";
import { BsBookmarkPlus } from "react-icons/bs";
import "./Addnewbtn.css";
import { Button } from "react-bootstrap";

function Addpropertybtn() {
  return (
    <>
      <Button variant="primary" className="addProperty-btn">
        <BsBookmarkPlus />
        ADD NEW
      </Button>
    </>
  );
}

export default Addpropertybtn;
