import React, { useEffect, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import Addpropertybtn from "../add-new-btn/Addpropertybtn";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
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
import "./TopPriority.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { getMicrolocationByCity } from "../coworking-space/WorkSpaceService";
import { getCity } from "../brands/BrandService";
import Select from "react-select";
import { getWorkSpaceDataByMicrolocation } from "./TopPriorityService";
import BASE_URL from "../../apiConfig";
function TopPrioritySpace() {
  const [loading, setLoading] = useState(false);
  const [workSpaces, setWorkSpaces] = useState([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [microLocationSearchTerm, setMicroLocationSearchTerm] = useState("");
  const [searchedWorkSpaces, setSearchedWorkSpaces] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [searchOption, setSearchOption] = useState("");
  const [cities, setCities] = useState([]);
  const [microlocations, setMicrolocations] = useState([]);
  const toast = useToast();
  const [selectedMicroLocation, setSelectedMicroLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const handleFetchCity = async () => {
    await getCity(setCities);
  };
  const handleFetchMicrolocation = async (cityId) => {
    await getMicrolocationByCity(cityId, setMicrolocations);
  };
  const handleFetchWorkSpaceData = async (name) => {
    await getWorkSpaceDataByMicrolocation(setLoading, setWorkSpaces, name);
  };
  const onChangeOptionHandler = (selectedOption, dropdownIdentifier) => {
    switch (dropdownIdentifier) {
      case "city":
        setSelectedCity(selectedOption);

        handleFetchMicrolocation(selectedOption ? selectedOption.value : null);
        break;
      case "microLocation":
        setSelectedMicroLocation(selectedOption);
        handleFetchWorkSpaceData(selectedOption ? selectedOption.label : "");
        break;
      default:
        break;
    }
  };
  const microLocationOptions = microlocations?.map((microLocation) => ({
    value: microLocation._id,
    label: microLocation.name,
  }));
  const cityOptions = cities?.map((city) => ({
    value: city._id,
    label: city.name,
  }));

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
    handleSearch();
    handleFetchCity();
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

  const [selectItemNum, setSelectItemNum] = useState(5);
  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const nPage = Math.ceil(searchedWorkSpaces?.length / selectItemNum);
  if (firstIndex > 0) {
    var prePage = () => {
      if (curPage !== firstIndex) {
        setCurPage(curPage - 1);
      }
    };
  }

  var nextPage = () => {
    const lastPage = Math.ceil(workSpaces.length / selectItemNum);
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
  const [selectedWorkspaces, setSelectedWorkspaces] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  // const handleCheckboxChange = (workspace) => {
  //   if (selectedWorkspaces.some((item) => item._id === workspace._id)) {
  //     // Uncheck the checkbox and remove the workspace from the selected list
  //     setSelectedWorkspaces(
  //       selectedWorkspaces.filter((item) => item._id !== workspace._id)
  //     );
  //     handleSavePriority(workspace, 1000); // Set default priority of 1000
  //   } else {
  //     // Check the checkbox and add the workspace to the selected list with updated priority
  //     const updatedWorkspaces = [
  //       ...selectedWorkspaces,
  //       { ...workspace, priority: selectedWorkspaces.length + 1 },
  //     ];
  //     updatedWorkspaces.forEach((item, index) => {
  //       item.priority = index + 1;
  //       handleSavePriority(item, item.priority);
  //     });
  //     setSelectedWorkspaces(updatedWorkspaces);
  //   }
  // };
  const handleCheckboxChange = (workspace) => {
    const isChecked = selectedWorkspaces.some(
      (item) => item._id === workspace._id
    );
    if (isChecked) {
      setSelectedWorkspaces(
        selectedWorkspaces.filter((item) => item._id !== workspace._id)
      );
      handleSavePriority(workspace, 1000);
    } else {
      const updatedWorkspaces = [
        ...selectedWorkspaces,
        { ...workspace, priority: selectedWorkspaces.length + 1 },
      ];
      updatedWorkspaces.forEach((item, index) => {
        item.priority = index + 1;
        handleSavePriority(item, item.priority);
      });
      console.log(updatedWorkspaces);
      setSelectedWorkspaces(updatedWorkspaces);
    }

    setIsChecked(!isChecked);
  };
  const handleSavePriority = (workspace, order) => {
    axios
      .put(`${BASE_URL}/api/workSpace/workSpaces/change-order/priority`, {
        data: {
          is_active: true,
          order: 24,
          city: "5e3e77de936bc06de1f9a5e2",
          name: "",
        },
        id: "641172a36700335e98ca0f9b",
        type: "location",
      })
      .then((response) => {
        const updatedWorkspace = response.data;
        setWorkSpaces(
          workSpaces.map((item) =>
            item._id === updatedWorkspace._id ? updatedWorkspace : item
          )
        );
      })
      .catch((error) => {
        console.error("Error updating workspace priority:", error);
      });
  };

  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="table-box">
        <div className="table-top-box">Priority Coworking Spaces Table</div>
        <TableContainer style={{ overflowX: "hidden" }}>
          <div className="row my-5">
            <div className="col-md-3">
              <Select
                placeholder="City*"
                value={selectedCity}
                options={cityOptions}
                onChange={(selectedOption) =>
                  onChangeOptionHandler(selectedOption, "city")
                }
                isSearchable
                required
              />
            </div>
            <div className="col-md-3">
              <Select
                placeholder="Microlocation*"
                value={selectedMicroLocation}
                options={microLocationOptions}
                onChange={(selectedOption) =>
                  onChangeOptionHandler(selectedOption, "microLocation")
                }
                isSearchable
                required
              />
            </div>
          </div>
        </TableContainer>
      </div>
      <div className="table_container">
        <div className="table-box top_table_box1">
          <div className="table-top-box">Coworking Spaces Table</div>
          <TableContainer style={{ overflowX: "hidden" }}>
            <div className="data_table">
              <div className="row">
                <div className="col-md-12">
                  <Table variant="simple" className="table_border">
                    <Thead>
                      <Tr className="table_heading_row">
                        <Th>Select</Th>
                        <Th>Name</Th>
                        <Th>City</Th>
                        <Th>MicroLocation</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {loading ? (
                        <Tr>
                          <Td colSpan={8} textAlign="center">
                            <Spinner size="lg" />
                          </Td>
                        </Tr>
                      ) : (
                        workSpaces.map((space) => (
                          <Tr key={space._id}>
                            <Td>
                              <input
                                type="checkbox"
                                checked={selectedWorkspaces.some(
                                  (item) => item._id === space._id
                                )}
                                onChange={() => handleCheckboxChange(space)}
                              />
                              {/* <input
                                type="checkbox"
                                checked={selectedWorkspaces.some(
                                  (item) => item._id === space._id
                                )}
                                onChange={() => handleCheckboxChange(space)}
                              /> */}
                            </Td>
                            <Td>{space?.name}</Td>
                            <Td className="city_heading">
                              {space.location.city
                                ? space.location.city.name
                                : ""}
                            </Td>
                            <Td>
                              {space.location.micro_location
                                ? space.location.micro_location.name
                                : ""}
                            </Td>
                          </Tr>
                        ))
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
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>
              <div style={{ width: "110px" }}>
                {firstIndex + 1} -{" "}
                {showAll
                  ? workSpaces.slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    ).length + firstIndex
                  : searchedWorkSpaces?.length}{" "}
                of {workSpaces?.length}
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
        <div className="table-box top_table_box2">
          <div className="table-top-box">Top Priority Spaces Table</div>
          <TableContainer style={{ overflowX: "hidden" }}>
            <div className="data_table">
              <div className="row">
                <div className="col-md-12">
                  <Table variant="simple" className="table_border">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>City</Th>
                        <Th>MicroLocation</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {selectedWorkspaces.map((space) => (
                        <Tr key={space._id}>
                          <Td>{space.name}</Td>
                          <Td className="city_heading">
                            {space.location.city
                              ? space.location.city.name
                              : ""}
                          </Td>
                          <Td>
                            {space.location.micro_location
                              ? space.location.micro_location.name
                              : ""}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </div>
            </div>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default TopPrioritySpace;
