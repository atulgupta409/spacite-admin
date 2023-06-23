import React, { useState, useEffect } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { BsBookmarkPlus } from "react-icons/bs";
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
import { config, postConfig } from "../../services/Services";
import BASE_URL from "../../apiConfig";

function City() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [cityfield, setCityfield] = useState({
    name: "",
    country: "",
    state: "",
    description: "",
  });
  const [states, setStates] = useState([]);
  const [countryId, setCountryId] = useState(null);
  const [stateId, setStateId] = useState(null);
  const { country, setCountry } = GpState();

  const [selectItemNum, setSelectItemNum] = useState(10);
  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = cities?.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(cities?.length / recordsPerPage);

  const toast = useToast();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCityfield({
      ...cityfield,
      [name]: value,
    });
  };

  const handleSaveCity = async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/city/cities`,
        {
          name: cityfield.name,
          description: cityfield.description,
          country: countryId,
          state: stateId,
        },
        postConfig
      );
      setCityfield({
        name: "",
        description: "",
        country: "",
        state: "",
      });
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
  const getCity = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/city/cities`, config);
      setLoading(false);
      setCities(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getStateByCountry = async () => {
    try {
      setLoading(true);

      await axios
        .post(
          `${BASE_URL}/api/state/statesbycountry`,
          { country_id: countryId },
          postConfig
        )
        .then((result) => {
          console.log(result.data);
          setStates(result.data);
        });
      setLoading(false);
      // setStates(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getCountry = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${BASE_URL}/api/allCountry/countries`,
        config
      );
      setLoading(false);
      setCountry(data.country);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteCity = async (id) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/api/city/delete/${id}`,
        config
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
    getCountry();
    getCity();
  }, [updateTable]);
  const onChangeHandler = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    const option = el.getAttribute("id");
    const { name, value } = e.target;
    setCityfield({
      ...cityfield,
      [name]: value,
    });
    setCountryId(option);
  };
  const onChangeHandlerState = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    const option = el.getAttribute("id");
    const { name, value } = e.target;
    setCityfield({
      ...cityfield,
      [name]: value,
    });
    setStateId(option);
  };

  if (firstIndex > 0) {
    var prePage = () => {
      if (curPage !== firstIndex) {
        setCurPage(curPage - 1);
      }
    };
  }

  if (records?.length === selectItemNum) {
    var nextPage = () => {
      if (curPage !== lastIndex) {
        setCurPage(curPage + 1);
      }
    };
  }

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
              <ModalHeader>Add New City</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <div className="d-flex justify-content-between">
                  <div className="select-box">
                    <select
                      name="country"
                      value={cityfield.country}
                      onChange={onChangeHandler}
                      onClick={getStateByCountry}
                    >
                      <option>Select Country</option>
                      {country?.map((countryElem) => (
                        <option
                          id={countryElem._id}
                          key={countryElem._id}
                          value={countryElem.name}
                        >
                          {countryElem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="select-box">
                    <select
                      name="state"
                      value={cityfield.state}
                      onChange={onChangeHandlerState}
                    >
                      <option>Select State</option>
                      {states?.map((stateElem) => (
                        <option
                          id={stateElem._id}
                          key={stateElem._id}
                          value={stateElem.name}
                        >
                          {stateElem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <input
                  name="name"
                  value={cityfield.name}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Name"
                  className="property-input"
                />
                <input
                  name="description"
                  value={cityfield.description}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Description"
                  className="property-input"
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="ghost" onClick={handleSaveCity}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        <div className="table-box">
          <div className="table-top-box">City Table</div>
          <TableContainer marginTop="60px" variant="striped" color="teal">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Country</Th>
                  <Th>State</Th>
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
                ) : (
                  records?.map((city) => (
                    <Tr key={city._id} id={city._id}>
                      <Td>{city.name}</Td>
                      <Td>{city.country?.name}</Td>
                      <Td>{city.state?.name}</Td>
                      <Td>
                        <Delete
                          handleFunction={() => handleDeleteCity(city._id)}
                        />
                      </Td>
                    </Tr>
                  ))
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
                  required
                  value={selectItemNum}
                  onChange={itemsPerPageHandler}
                  style={{ paddingLeft: "0" }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div style={{ width: "110px" }}>
                {firstIndex + 1} - {records?.length + firstIndex} of{" "}
                {cities?.length}
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

export default City;
