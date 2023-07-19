import React, { useEffect, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
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
import axios from "axios";
import { getMicrolocationByCity } from "./PriorityService";
import { getCity } from "../brands/BrandService";
import Select from "react-select";
import BASE_URL from "../../apiConfig";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getMicrolocationWithPriority } from "./PriorityService";
function PriorityMicrolocation() {
  const [updateTable, setUpdateTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [microLocationSearchTerm, setMicroLocationSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [searchOption, setSearchOption] = useState("");
  const [cities, setCities] = useState([]);
  const [microlocations, setMicrolocations] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [priorityMicrolocation, setPriorityMicrolocation] = useState([]);
  const [loadingMicro, setLoadingMicro] = useState(false);
  const [loadingAllMicro, setLoadingAllMicro] = useState(false);
  const handleFetchCity = async () => {
    await getCity(setCities);
  };
  const handleFetchMicrolocation = async (cityId) => {
    await getMicrolocationByCity(cityId, setMicrolocations, setLoadingAllMicro);
  };
  const handleFetchPriorityMicrolocation = async (cityId) => {
    await getMicrolocationWithPriority(
      setLoadingMicro,
      setPriorityMicrolocation,
      cityId
    );
  };
  const onChangeOptionHandler = (selectedOption, dropdownIdentifier) => {
    switch (dropdownIdentifier) {
      case "city":
        setSelectedCity(selectedOption);

        handleFetchMicrolocation(selectedOption ? selectedOption.value : null);
        handleFetchPriorityMicrolocation(
          selectedOption ? selectedOption.value : null
        );
        break;
      default:
        break;
    }
  };
  const cityOptions = cities?.map((city) => ({
    value: city._id,
    label: city.name,
  }));

  useEffect(() => {
    handleFetchCity();
  }, []);

  const [selectItemNum, setSelectItemNum] = useState(5);
  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  //   const [curPage, setCurPage] = useState(1);
  //   const recordsPerPage = selectItemNum;
  //   const lastIndex = curPage * recordsPerPage;
  //   const firstIndex = lastIndex - recordsPerPage;
  //   //   const nPage = Math.ceil(searchedWorkSpaces?.length / selectItemNum);
  //   if (firstIndex > 0) {
  //     var prePage = () => {
  //       if (curPage !== firstIndex) {
  //         setCurPage(curPage - 1);
  //       }
  //     };
  //   }

  //   var nextPage = () => {
  //     const lastPage = Math.ceil(workSpaces.length / selectItemNum);
  //     if (curPage < lastPage) {
  //       setCurPage((prev) => prev + 1);
  //     }
  //   };

  //   const getFirstPage = () => {
  //     setCurPage(1);
  //   };

  //   const getLastPage = () => {
  //     setCurPage(nPage);
  //   };

  const handleCheckboxChange = async (event, micro) => {
    const { checked } = event.target;
    handleFetchPriorityMicrolocation(selectedCity?.value);
    try {
      const updatedMicrolocation = {
        order: checked
          ? microlocations.filter((micro) => micro.priority.is_active == true)
              .length + 1
          : 1000,
        is_active: checked,
        microlocationId: micro._id,
      };

      await axios.put(
        `${BASE_URL}/api/priority-microlocation/${micro._id}`,
        updatedMicrolocation
      );
      micro.priority.is_active = checked;
      setMicrolocations([...microlocations]);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) return; // Dropped outside the list
    if (destination.index === source.index) return; // Dropped in the same position

    const recordedMicro = Array.from(priorityMicrolocation);
    const [movedSpace] = recordedMicro.splice(source.index, 1);
    recordedMicro.splice(destination.index, 0, movedSpace);

    // Create the payload with updated priority order for each coworking space
    const updatedOrderPayload = recordedMicro.map((micro, index) => ({
      _id: micro._id,
      priority: {
        order: index + 1,
      },
    }));

    setPriorityMicrolocation(recordedMicro);

    // Send API request to update the priority order on drag and drop
    try {
      const response = await fetch(
        `${BASE_URL}/api/updateMicrolocationPriority`,
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
        <div className="table-top-box">Priority Microlocation Table</div>
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
                        <Th>MicroLocation</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {loadingAllMicro ? (
                        <Tr>
                          <Td colSpan={8} textAlign="center">
                            <Spinner size="lg" />
                          </Td>
                        </Tr>
                      ) : (
                        microlocations.map((micro) => (
                          <Tr key={micro._id}>
                            <Td>
                              <input
                                type="checkbox"
                                checked={micro.priority.is_active}
                                onChange={(event) =>
                                  handleCheckboxChange(event, micro)
                                }
                              />
                            </Td>
                            <Td>{micro?.name}</Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                </div>
              </div>
            </div>
          </TableContainer>
          {/* <nav className="mt-5">
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
          </nav> */}
        </div>
        <div className="table-box top_table_box2">
          <div className="table-top-box">Top Priority MicroLocation Table</div>
          <TableContainer style={{ overflowX: "hidden" }}>
            <div className="data_table">
              <div className="row">
                <div className="col-md-12">
                  <Table variant="simple" className="table_border">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                      </Tr>
                    </Thead>

                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="microlocations">
                        {(provided) => (
                          <Tbody
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {loadingMicro ? (
                              <Tr>
                                <Td colSpan={3} textAlign="center">
                                  <Spinner size="lg" />
                                </Td>
                              </Tr>
                            ) : (
                              priorityMicrolocation.map((micro, index) => (
                                <Draggable
                                  key={micro._id}
                                  draggableId={micro._id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <Tr
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                    >
                                      <Td {...provided.dragHandleProps}>
                                        {micro?.name}
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

export default PriorityMicrolocation;
