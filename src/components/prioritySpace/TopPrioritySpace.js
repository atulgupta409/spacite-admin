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
import {
  getWorkSpaceDataByMicrolocation,
  getWorkSpaceDataByMicrolocationWithPriority,
} from "./TopPriorityService";
import BASE_URL from "../../apiConfig";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
  const [priorityWorkSpaces, setPriorityWorkSpaces] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const handleFetchCity = async () => {
    await getCity(setCities);
  };
  const handleFetchMicrolocation = async (cityId) => {
    await getMicrolocationByCity(cityId, setMicrolocations);
  };
  const handleFetchWorkSpaceData = async (name) => {
    await getWorkSpaceDataByMicrolocation(setLoading, setWorkSpaces, name);
  };
  const handleFetchPriorityWorkspaces = async (name) => {
    await getWorkSpaceDataByMicrolocationWithPriority(
      setLoadingTable,
      setPriorityWorkSpaces,
      name
    );
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
        handleFetchPriorityWorkspaces(
          selectedOption ? selectedOption.label : ""
        );
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

  const handleCheckboxChange = async (event, coworkingSpace) => {
    const { checked } = event.target;
    handleFetchPriorityWorkspaces(selectedMicroLocation?.label);
    try {
      const updatedSpace = {
        order: checked
          ? workSpaces.filter((space) => space.priority.is_active == true)
              .length + 1
          : 1000,
        is_active: checked,
        microlocationId: selectedMicroLocation?.value,
      };

      await axios.put(
        `${BASE_URL}/api/coworkingspaces/${coworkingSpace._id}`,
        updatedSpace
      );
      coworkingSpace.priority.is_active = checked;
      setWorkSpaces([...workSpaces]);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) return; // Dropped outside the list
    if (destination.index === source.index) return; // Dropped in the same position

    const reorderedSpaces = Array.from(priorityWorkSpaces);
    const [movedSpace] = reorderedSpaces.splice(source.index, 1);
    reorderedSpaces.splice(destination.index, 0, movedSpace);

    // Create the payload with updated priority order for each coworking space
    const updatedOrderPayload = reorderedSpaces.map((space, index) => ({
      _id: space._id,
      priority: {
        order: index + 1,
      },
    }));

    setPriorityWorkSpaces(reorderedSpaces);

    // Send API request to update the priority order on drag and drop
    try {
      const response = await fetch(
        `${BASE_URL}/api/updateCoworkingSpacesPriority`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOrderPayload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update priority order.");
      }
    } catch (error) {
      console.error("Error updating priority order:", error);
      // Handle error (e.g., show an error message to the user)
    }
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
                              {/* <input
                                type="checkbox"
                                checked={selectedWorkspaces.some(
                                  (item) => item._id === space._id
                                )}
                                onChange={() => handleCheckboxChange(space)}
                              /> */}
                              <input
                                type="checkbox"
                                checked={space.priority.is_active}
                                onChange={(event) =>
                                  handleCheckboxChange(event, space)
                                }
                              />
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

                        <Th>MicroLocation</Th>
                      </Tr>
                    </Thead>

                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="coworkingSpaces">
                        {(provided) => (
                          <Tbody
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {loadingTable ? (
                              <Tr>
                                <Td colSpan={3} textAlign="center">
                                  <Spinner size="lg" />
                                </Td>
                              </Tr>
                            ) : (
                              priorityWorkSpaces.map((space, index) => (
                                <Draggable
                                  key={space._id}
                                  draggableId={space._id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <Tr
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                    >
                                      <Td {...provided.dragHandleProps}>
                                        {space?.name}
                                      </Td>

                                      <Td>
                                        {space.location.micro_location
                                          ? space.location.micro_location.name
                                          : ""}
                                      </Td>
                                    </Tr>
                                  )}
                                </Draggable>
                              ))
                            )}
                            {provided.placeholder}
                          </Tbody>
                        )}
                      </Droppable>
                    </DragDropContext>
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
