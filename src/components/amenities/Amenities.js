import React, { useState, useEffect } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { BsBookmarkPlus } from "react-icons/bs";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { GpState } from "../../context/context";
import Delete from "../delete/Delete";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import BASE_URL from "../../apiConfig";
function Amenities() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [updateTable, setUpdateTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [searchedAmenities, setSearchedAmenities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(true);
  const toast = useToast();

  const handleSaveAmenities = async () => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/amenity/amenities`, {
        name: name,
        icon: icon,
      });
      setName("");
      setIcon("");
      setUpdateTable((prev) => !prev);
      onClose();
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

  const getAmenities = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/amenity/amenities`);
      const newData = data.reverse();
      setAmenities(newData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteAmenities = async (id) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/api/amenity/delete/${id}`
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
  useEffect(() => {
    getAmenities();
  }, [updateTable]);
  const handleSearch = () => {
    const filteredAmenities = amenities.filter((amenity) => {
      const matchName =
        amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(amenity.name.toLowerCase());

      return matchName;
    });

    setSearchedAmenities(filteredAmenities);
    setCurPage(1);
  };

  useEffect(() => {
    handleSearch();
    setShowAll(searchTerm === "");
  }, [updateTable, searchTerm]);

  const [selectItemNum, setSelectItemNum] = useState(5);
  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const nPage = Math.ceil(
    (showAll ? amenities.length : searchedAmenities.length) / selectItemNum
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
      (showAll ? amenities.length : searchedAmenities.length) / selectItemNum
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
    <>
      <div className="mx-5 mt-3">
        <Mainpanelnav />
        <div className="d-flex justify-content-end w-100">
          <Button className="addnew-btn" onClick={onOpen}>
            <BsBookmarkPlus />
            ADD NEW
          </Button>
        </div>
        <div>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New Amenity</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <input
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Name"
                  className="property-input"
                />
                <input
                  name="description"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  type="text"
                  placeholder="Image Url"
                  className="property-input"
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="ghost" onClick={handleSaveAmenities}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        <div className="table-box">
          <div className="table-top-box">Amenities Module</div>
          <TableContainer
            marginTop="60px"
            variant="striped"
            color="teal"
            overflowX="hidden"
          >
            <div className="row">
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
                  <label htmlFor="floatingInput">Search by name</label>
                </div>
              </div>
            </div>
            <Table variant="simple" marginTop="20px">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Icon</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <Tr>
                    <Td>
                      <Spinner
                        size="xl"
                        w={20}
                        h={20}
                        alignSelf="center"
                        style={{ position: "absolute", left: "482px" }}
                      />
                    </Td>
                  </Tr>
                ) : showAll ? (
                  amenities
                    .slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    )
                    .map((amenity) => (
                      <Tr key={amenity._id} id={amenity._id}>
                        <Td>{amenity.name}</Td>
                        <Td>{amenity.icon}</Td>
                        <Td>
                          <Delete
                            handleFunction={() =>
                              handleDeleteAmenities(amenity._id)
                            }
                          />
                        </Td>
                      </Tr>
                    ))
                ) : searchedAmenities.length > 0 ? (
                  searchedAmenities
                    .slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    )
                    .map((amenity) => (
                      <Tr key={amenity._id} id={amenity._id}>
                        <Td>{amenity.name}</Td>
                        <Td>{amenity.icon}</Td>
                        <Td>
                          <Delete
                            handleFunction={() =>
                              handleDeleteAmenities(amenity._id)
                            }
                          />
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
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div style={{ width: "110px" }}>
                {firstIndex + 1} -{" "}
                {showAll
                  ? amenities.slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    ).length + firstIndex
                  : searchedAmenities?.slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    ).length + firstIndex}{" "}
                of {showAll ? amenities?.length : searchedAmenities.length}
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
    </>
  );
}

export default Amenities;
