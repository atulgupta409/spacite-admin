import React, { useEffect, useState } from "react";
import "./CoworkingSpace.css";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import Addpropertybtn from "../add-new-btn/Addpropertybtn";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { changeWorkSpaceStatus } from "./WorkSpaceService";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Link } from "react-router-dom";
import Delete from "../delete/Delete";
import { AiFillEdit } from "react-icons/ai";
import { getWorkSpaceData } from "./WorkSpaceService";
import Desable from "../delete/Desable";
import Approve from "../delete/Approve";
import BASE_URL from "../../apiConfig";
function CoworkingSpace() {
  const [loading, setLoading] = useState(false);
  const [workSpaces, setWorkSpaces] = useState([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [microLocationSearchTerm, setMicroLocationSearchTerm] = useState("");
  const [searchedWorkSpaces, setSearchedWorkSpaces] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [searchOption, setSearchOption] = useState("");

  const toast = useToast();

  const handleFetchWorkSpace = async () => {
    await getWorkSpaceData(setLoading, setWorkSpaces);
  };

  const handleSearch = () => {
    const filteredWorkSpaces = workSpaces.filter((workSpace) => {
      const cityName = workSpace.location.city?.name || "city";
      const microLocationName =
        workSpace.location.micro_location?.name || "microlocation";
      const statusName = workSpace.status;
      const matchName =
        workSpace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(workSpace.name.toLowerCase());

      const matchCity =
        cityName.toLowerCase().includes(citySearchTerm.toLowerCase()) ||
        citySearchTerm.toLowerCase().includes(cityName.toLowerCase());

      const matchMicroLocation =
        microLocationName
          .toLowerCase()
          .includes(microLocationSearchTerm.toLowerCase()) ||
        microLocationSearchTerm
          .toLowerCase()
          .includes(microLocationName.toLowerCase());
      const matchStatus =
        statusName.includes(searchOption) || searchOption === "All"
          ? workSpace
          : "";
      return matchName && matchCity && matchMicroLocation && matchStatus;
    });

    setSearchedWorkSpaces(filteredWorkSpaces);
    setCurPage(1);
  };

  useEffect(() => {
    handleFetchWorkSpace();
    handleSearch();
    setShowAll(
      searchTerm === "" &&
        citySearchTerm === "" &&
        microLocationSearchTerm === "" &&
        searchOption === ""
    );
  }, [
    updateTable,
    searchTerm,
    citySearchTerm,
    microLocationSearchTerm,
    searchOption,
  ]);
  const handleDeleteWorkSpaces = async (id) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/api/workSpace/delete/${id}`
      );
      setUpdateTable((prev) => !prev);
      toast({
        title: "Deleted Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleApprove = async (id) => {
    await changeWorkSpaceStatus(id, "approve", setUpdateTable, toast);
    setSearchTerm("");
    setCitySearchTerm("");
    setMicroLocationSearchTerm("");
    setSearchOption("");
  };
  const handleReject = async (id) => {
    await changeWorkSpaceStatus(id, "reject", setUpdateTable, toast);
    setSearchTerm("");
    setCitySearchTerm("");
    setMicroLocationSearchTerm("");
    setSearchOption("");
  };
  const [selectItemNum, setSelectItemNum] = useState(10);
  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const nPage = Math.ceil(
    (showAll ? workSpaces.length : searchedWorkSpaces?.length) / selectItemNum
  );
  if (firstIndex > 0) {
    var prePage = () => {
      if (curPage !== firstIndex) {
        setCurPage(curPage - 1);
      }
    };
  }

  var nextPage = () => {
    const lastPage = Math.ceil(
      (showAll ? workSpaces.length : searchedWorkSpaces.length) / selectItemNum
    );
    if (curPage < lastPage) {
      setCurPage((prev) => prev + 1);
    }
  };

  const getFirstPage = () => {
    setCurPage(1);
  };

  const getLastPage = () => {
    setCurPage(nPage);
  };
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <Link to="/coworking-space/add-coworking-space" className="btnLink mt-2">
        <Addpropertybtn buttonText={"ADD NEW CW"} />
      </Link>
      <div className="table-box space-table-box">
        <div className="table-top-box">Coworking Module</div>
        <TableContainer overflowX="hidden">
          <div className="row my-5">
            <div className="col-md-3">
              <div className="form-floating border_field">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <label htmlFor="floatingInput">Search By CW Name</label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-floating border_field">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Search by city"
                  value={citySearchTerm}
                  onChange={(e) => setCitySearchTerm(e.target.value)}
                />
                <label htmlFor="floatingInput">Search By City</label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-floating border_field">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Search by microlocation"
                  value={microLocationSearchTerm}
                  onChange={(e) => setMicroLocationSearchTerm(e.target.value)}
                />
                <label htmlFor="floatingInput">Search By Location</label>
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-floating">
                <select
                  className="form-select"
                  id="floatingSelectGrid"
                  aria-label="Floating label select example"
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="pending">pending</option>
                  <option value="reject">reject</option>
                  <option value="approve">approve</option>
                </select>
                <label htmlFor="floatingSelectGrid">Search By Status</label>
              </div>
            </div>
          </div>
          <div className="data_table">
            <div className="row">
              <div className="col-md-12">
                <Table variant="simple">
                  <Thead>
                    <Tr className="table_heading_row">
                      <Th className="name_heading">NAME OF CW</Th>
                      <Th className="city_heading">CITY</Th>
                      <Th className="micro_heading">LOCATION</Th>
                      <Th className="time_heading">ADDED ON</Th>
                      <Th className="status_heading">STATUS</Th>
                      <Th className="edit_heading">EDIT</Th>
                      <Th className="preview_heading">PREVIEW</Th>
                      <Th className="action_heading">ACTION</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {loading ? (
                      <Tr>
                        <Td colSpan={8} textAlign="center">
                          <Spinner size="lg" />
                        </Td>
                      </Tr>
                    ) : showAll ? (
                      workSpaces
                        ?.slice(
                          (curPage - 1) * selectItemNum,
                          curPage * selectItemNum
                        )

                        .map((workSpace) => (
                          <Tr className="table_data_row" key={workSpace._id}>
                            <Td className="name_heading">{workSpace.name}</Td>
                            <Td className="city_heading">
                              {workSpace.location.city
                                ? workSpace.location.city.name
                                : ""}
                            </Td>
                            <Td className="micro_heading">
                              {workSpace.location.micro_location
                                ? workSpace.location.micro_location.name
                                : ""}
                            </Td>

                            <Td className="time_heading">
                              {new Intl.DateTimeFormat("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }).format(new Date(workSpace.createdAt))}
                            </Td>
                            <Td className="status_heading" textAlign="center">
                              {workSpace.status === "approve"
                                ? "AP"
                                : workSpace.status === "reject"
                                ? "RJ"
                                : workSpace.status === "pending"
                                ? "PD"
                                : ""}
                            </Td>
                            <Td className="edit_heading">
                              <Link
                                to={`/coworking-space/edit-workspace/${workSpace._id}`}
                                target="_blank"
                              >
                                <AiFillEdit
                                  style={{
                                    marginLeft: "0.5rem",
                                    fontSize: "20px",
                                  }}
                                />
                              </Link>
                            </Td>
                            <Td className="preview_heading">
                              <Link
                                to={`https://spacite.com/coworking/${workSpace.slug}`}
                                target="_blank"
                              >
                                <AiOutlineEye
                                  style={{
                                    margin: "auto",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                  }}
                                />
                              </Link>
                            </Td>
                            <Td className="action_heading">
                              <div
                                className="d-flex justify-content-between align-items-center"
                                style={{ width: "100px !important" }}
                              >
                                <Approve
                                  handleFunction={() =>
                                    handleApprove(workSpace._id)
                                  }
                                />
                                <Desable
                                  handleFunction={() =>
                                    handleReject(workSpace._id)
                                  }
                                />

                                <Delete
                                  handleFunction={() =>
                                    handleDeleteWorkSpaces(workSpace._id)
                                  }
                                />
                              </div>
                            </Td>
                          </Tr>
                        ))
                    ) : searchedWorkSpaces.length > 0 ? (
                      searchedWorkSpaces
                        .slice(
                          (curPage - 1) * selectItemNum,
                          curPage * selectItemNum
                        )

                        .map((workSpace, index) => (
                          <Tr className="table_data_row" key={workSpace._id}>
                            <Td className="name_heading">{workSpace.name}</Td>
                            <Td className="city_heading">
                              {workSpace.location.city
                                ? workSpace.location.city.name
                                : ""}
                            </Td>
                            <Td className="micro_heading">
                              {workSpace.location.micro_location
                                ? workSpace.location.micro_location.name
                                : ""}
                            </Td>

                            <Td className="time_heading">
                              {new Intl.DateTimeFormat("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }).format(new Date(workSpace.createdAt))}
                            </Td>
                            <Td className="status_heading" textAlign="center">
                              {workSpace.status === "approve"
                                ? "AP"
                                : workSpace.status === "reject"
                                ? "RJ"
                                : workSpace.status === "pending"
                                ? "PD"
                                : ""}
                            </Td>
                            <Td className="edit_heading">
                              <Link
                                to={`/coworking-space/edit-workspace/${workSpace._id}`}
                                target="_blank"
                              >
                                <AiFillEdit
                                  style={{
                                    marginLeft: "0.5rem",
                                    fontSize: "20px",
                                  }}
                                />
                              </Link>
                            </Td>
                            <Td className="preview_heading">
                              <Link
                                to={`https://spacite.com/coworking/${workSpace.slug}`}
                                target="_blank"
                              >
                                <AiOutlineEye
                                  style={{
                                    margin: "auto",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                  }}
                                />
                              </Link>
                            </Td>
                            <Td className="action_heading">
                              <div
                                className="d-flex justify-content-between align-items-center main-div"
                                style={{ width: "100px !important" }}
                              >
                                <Approve
                                  handleFunction={() =>
                                    handleApprove(workSpace._id)
                                  }
                                />
                                <Desable
                                  handleFunction={() =>
                                    handleReject(workSpace._id)
                                  }
                                />

                                <Delete
                                  handleFunction={() =>
                                    handleDeleteWorkSpaces(workSpace._id)
                                  }
                                />
                              </div>
                            </Td>
                          </Tr>
                        ))
                    ) : (
                      <Tr>
                        <Td colSpan={8}>No matching results found.</Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </div>
            </div>
          </div>
        </TableContainer>
        <nav className="mt-5">
          <div
            className="d-flex align-items-center justify-content-between"
            style={{ width: "51%" }}
          >
            <p className="mb-0">Items per page: </p>
            <div style={{ borderBottom: "1px solid gray" }}>
              <select
                className="form-select"
                aria-label="Default select example"
                value={selectItemNum}
                onChange={itemsPerPageHandler}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div style={{ width: "110px" }}>
              {firstIndex + 1} -{" "}
              {showAll
                ? workSpaces.slice(
                    (curPage - 1) * selectItemNum,
                    curPage * selectItemNum
                  ).length + firstIndex
                : searchedWorkSpaces?.slice(
                    (curPage - 1) * selectItemNum,
                    curPage * selectItemNum
                  ).length + firstIndex}{" "}
              of {showAll ? workSpaces?.length : searchedWorkSpaces.length}
            </div>

            <div className="page-item">
              <BiSkipPrevious onClick={getFirstPage} />
            </div>
            <div className="page-item">
              <GrFormPrevious onClick={prePage} />
            </div>
            <div className="page-item">
              <GrFormNext onClick={nextPage} />
            </div>
            <div className="page-item">
              <BiSkipNext onClick={getLastPage} />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default CoworkingSpace;
