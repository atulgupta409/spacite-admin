import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import Loader from "../loader/Loader";
import { getSeoDataById } from "./SeoService";
import BASE_URL from "../../apiConfig";
import Cookies from "js-cookie";
const initialValue = {
  page_title: "",
  title: "",
  description: "",
  twitter: { title: "", description: "" },
  open_graph: { title: "", description: "" },
  path: "",
  keywords: "",
  robots: "",
  script: "",
  footer_title: "",
};

const EditSeo = () => {
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [seos, setSeos] = useState(initialValue);
  const {
    title,
    page_title,
    description,
    path,
    keywords,
    robots,
    script,
    twitter,
    open_graph,
    footer_title,
    footer_description,
  } = seos;
  const [updateTable, setUpdateTable] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const postConfig = {
    headers: {
      "Content-type": "application/json",

      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  };
  const handleInputChange = (e) => {
    setSeos({ ...seos, [e.target.name]: e.target.value });
  };
  const handleInputChangeObject = (event, section, property) => {
    const { value } = event.target;
    const updatedState = {
      ...seos,
      [section]: {
        ...seos[section],
        [property]: value,
      },
    };
    setSeos(updatedState);
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const footer_descrip = convertToRaw(editorState.getCurrentContent()).blocks[0]
    .text;

  const handleEditSeo = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/seo/seos/${id}`,
        {
          id,
          title,
          page_title,
          script,
          description,
          robots: indexed,
          index: isChecked,
          keywords,
          path,
          footer_title,
          footer_description: footer_descrip,
          twitter,
          open_graph,
        },
        postConfig
      );
      setSeos(data);
      setUpdateTable((prev) => !prev);
      navigate("/seo");
      toast({
        title: "Update Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const contentState = ContentState.createFromText(
      footer_description || "Empty"
    );
    const initialEditorState = EditorState.createWithContent(contentState);
    setEditorState(initialEditorState);
  }, [seos]);
  const handleFetchSeobyId = async () => {
    await getSeoDataById(setLoading, setSeos, setIsChecked, setIndexed, id);
  };
  useEffect(() => {
    handleFetchSeobyId();
  }, [updateTable]);
  const [indexed, setIndexed] = useState("noindex, nofollow");
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange2 = (event) => {
    const { checked } = event.target;
    setIsChecked(checked);
    setIndexed(checked ? "index, follow" : "noindex, nofollow");
  };
  if (loading) {
    return <Loader />;
  }
  console.log(indexed, isChecked);
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="container form-box">
        <form style={{ textAlign: "left" }} onSubmit={handleEditSeo}>
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Main Heading"
                    name="page_title"
                    onChange={(e) => handleInputChange(e)}
                    value={page_title}
                  />
                  <label htmlFor="floatingInput">Main Heading*</label>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    className="form-control"
                    id="floatingInput"
                    type="text"
                    placeholder="Title*"
                    name="title"
                    required
                    onChange={(e) => handleInputChange(e)}
                    value={title}
                  />
                  <label htmlFor="floatingInput">Title*</label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Path*"
                    name="path"
                    required
                    onChange={(e) => handleInputChange(e)}
                    value={path}
                  />
                  <label htmlFor="floatingInput">Path*</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    className="form-control"
                    id="floatingInput"
                    type="text"
                    placeholder="Description"
                    name="description"
                    onChange={(e) => handleInputChange(e)}
                    value={description}
                  />
                  <label htmlFor="floatingInput">Description*</label>
                </div>
              </div>
            </div>
            <div className="row">
              {/* <div className="col-md-6">
                <div
                  style={{ borderBottom: "1px solid gray", margin: "20px 0" }}
                >
                  <select
                    className="form-select"
                    aria-label="Default select example"
                  >
                    <option>Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div> */}
              <div className="col-md-12">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    type="text"
                    placeholder="Keywords*"
                    name="keywords"
                    className="form-control"
                    id="floatingInput"
                    onChange={(e) => handleInputChange(e)}
                    value={keywords}
                  />
                  <label htmlFor="floatingInput">Keywords*</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Twitter title"
                    name="twitter"
                    onChange={(event) =>
                      handleInputChangeObject(event, "twitter", "title")
                    }
                    value={twitter.title}
                  />
                  <label htmlFor="floatingInput">Twitter Title*</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Twitter description"
                    name="twitter"
                    onChange={(event) =>
                      handleInputChangeObject(event, "twitter", "description")
                    }
                    value={twitter.description}
                  />
                  <label htmlFor="floatingInput">Twitter Description*</label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Open graph title"
                    name="open_graph"
                    onChange={(event) =>
                      handleInputChangeObject(event, "open_graph", "title")
                    }
                    value={open_graph.title}
                  />
                  <label htmlFor="floatingInput">Open Graph Title*</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Open graph description"
                    name="open_graph"
                    onChange={(event) =>
                      handleInputChangeObject(
                        event,
                        "open_graph",
                        "description"
                      )
                    }
                    value={open_graph.description}
                  />
                  <label htmlFor="floatingInput">Open Graph Description*</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <textarea
                    cols="100"
                    rows="4"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Script tag"
                    name="script"
                    required
                    onChange={(e) => handleInputChange(e)}
                    value={script}
                  ></textarea>
                  <label htmlFor="floatingInput">Script*</label>
                </div>
              </div>
            </div>
            <div className="row pt-3">
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    checked={isChecked}
                    onChange={handleCheckboxChange2}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Discourage search engines from indexing this Page
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div
                  className="form-floating border_field"
                  style={{ marginTop: "6px" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Footer title"
                    name="footer_title"
                    onChange={(e) => handleInputChange(e)}
                    value={footer_title}
                  />
                  <label htmlFor="floatingInput">footer title*</label>
                </div>
              </div>
            </div>
            <h6>Footer description</h6>
            <div className="row">
              <div className="col-md-12">
                <Editor
                  editorState={editorState}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange}
                />
              </div>
            </div>
          </div>
          <div className="form-footer">
            <button type="submit" className="saveproperty-btn">
              Update
            </button>
            <button className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSeo;
