import React, { useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, Modifier, ContentState } from "draft-js";
import axios from "axios";
import { useDisclosure, Spinner, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../apiConfig";
import Cookies from "js-cookie";
import draftToHtml from "draftjs-to-html";
function AddSeoForm() {
  const toast = useToast();

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [seo, setSeo] = useState({
    heading: "",
    header_description: "",
    title: "",
    description: "",
    path: "",
    keywords: "",
    robots: "",
    twitterTitle: "",
    twitterDescription: "",
    graphTitle: "",
    graphDescription: "",
    script: "",
    footerTitle: "",
  });
  const [updateTable, setUpdateTable] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSeo({
      ...seo,
      [name]: value,
    });
  };

  const handleSaveSeo = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${BASE_URL}/api/seo/seos`, {
        title: seo.title,

        page_title: seo.heading,
        script: seo.script,
        header_description: seo.header_description,
        description: seo.description,
        robots: indexed,
        index: isChecked,
        keywords: seo.keywords,
        path: seo.path,
        footer_title: seo.footerTitle,
        footer_description: footer_descript_value,
        twitter: {
          title: seo.twitterTitle,
          description: seo.twitterDescription,
        },
        open_graph: {
          title: seo.graphTitle,
          description: seo.graphDescription,
        },
      });
      setSeo({
        heading: "",
        header_description: "",
        title: "",
        description: "",
        path: "",
        keywords: "",
        robots: "",
        twitterTitle: "",
        twitterDescription: "",
        graphTitle: "",
        graphDescription: "",
        script: "",
        footerTitle: "",
      });
      setUpdateTable((prev) => !prev);
      navigate("/seo");
      toast({
        title: "Saved Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const handlePastedText = (text, html, editorState) => {
    const plainText = text.replace(/(<([^>]+)>)/gi, ""); // Remove HTML tags
    const contentState = ContentState.createFromText(plainText);
    const newContentState = Modifier.replaceWithFragment(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      contentState.getBlockMap()
    );
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "insert-fragment"
    );
    setEditorState(newEditorState);
  };

  let footer_descript_value = draftToHtml(
    convertToRaw(editorState.getCurrentContent())
  );
  const [indexed, setIndexed] = useState("noindex, nofollow");
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange2 = (event) => {
    const { checked } = event.target;
    setIsChecked(checked);
    setIndexed(checked ? "index, follow" : "noindex, nofollow");
  };

  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="container form-box">
        <form style={{ textAlign: "left" }} onSubmit={handleSaveSeo}>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Main Heading*"
                    name="heading"
                    onChange={handleInputChange}
                    value={seo.heading}
                  />
                  <label htmlFor="floatingInput">Heading</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Header Description*"
                    name="header_description"
                    onChange={handleInputChange}
                    value={seo.header_description}
                  />
                  <label htmlFor="floatingInput">Header Decription</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Keywords*"
                    name="keywords"
                    onChange={handleInputChange}
                    value={seo.keywords}
                  />
                  <label htmlFor="floatingInput">Keywords</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Path*"
                    name="path"
                    required
                    onChange={handleInputChange}
                    value={seo.path}
                  />
                  <label htmlFor="floatingInput">Path*</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Meta Title*(Max Word 60)"
                    required
                    name="title"
                    onChange={handleInputChange}
                    value={seo.title}
                  />
                  <label htmlFor="floatingInput">
                    Meta Title*(Max Word 60)
                  </label>
                </div>
              </div>{" "}
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Description*(Max Word 160)"
                    required
                    name="description"
                    onChange={handleInputChange}
                    value={seo.description}
                  />
                  <label htmlFor="floatingInput">
                    Description*(Max Word 160)
                  </label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Twitter title"
                    name="twitterTitle"
                    onChange={handleInputChange}
                    value={seo.twitterTitle}
                  />
                  <label htmlFor="floatingInput">Twitter title</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Twitter description"
                    name="twitterDescription"
                    onChange={handleInputChange}
                    value={seo.twitterDescription}
                  />
                  <label htmlFor="floatingInput">Twitter description</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Open graph title"
                    name="graphTitle"
                    onChange={handleInputChange}
                    value={seo.graphTitle}
                  />
                  <label htmlFor="floatingInput">Open graph title</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Open graph description"
                    name="graphDescription"
                    onChange={handleInputChange}
                    value={seo.graphDescription}
                  />
                  <label htmlFor="floatingInput">Open graph description</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Script tag*"
                    name="script"
                    onChange={handleInputChange}
                    value={seo.script}
                  />
                  <label htmlFor="floatingInput">Script tag</label>
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
                    Check for indexing this Page
                  </label>
                </div>
              </div>
            </div>
            <div className="row mt-2 mb-5">
              <div className="col-md-6">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Footer title"
                    name="footerTitle"
                    onChange={handleInputChange}
                    value={seo.footerTitle}
                  />
                  <label htmlFor="floatingInput">Footer title</label>
                </div>
              </div>
            </div>
            <h6>Footer description</h6>
            <div className="row mt-4">
              <div className="col-md-12">
                <Editor
                  // editorState={editorState}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  handlePastedText={handlePastedText}
                  onEditorStateChange={(editorState) =>
                    onEditorStateChange(editorState)
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-footer">
            <button type="submit" className="saveproperty-btn">
              Save
            </button>
            <button className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSeoForm;
