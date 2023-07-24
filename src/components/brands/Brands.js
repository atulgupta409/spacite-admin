import React, { useState, useEffect } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { Link } from "react-router-dom";
import Addpropertybtn from "../add-new-btn/Addpropertybtn";
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
import Delete from "../delete/Delete";
import { AiFillEdit } from "react-icons/ai";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import BASE_URL from "../../apiConfig";
const Brands = () => {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedBrands, setSearchedBrands] = useState([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const toast = useToast();

  const getBrandsData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/brand/brands`);
      const newData = data.reverse();

      setBrands(newData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBrandsData();
  }, [updateTable]);

  const handleDeleteBrands = async (id) => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/api/brand/delete/${id}`);
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
  const handleSearch = () => {
    const filteredBrands = brands.filter((brand) => {
      const matchName =
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(brand.name.toLowerCase());

      return matchName;
    });

    setSearchedBrands(filteredBrands);
    setCurPage(1);
  };

  useEffect(() => {
    handleSearch();
    setShowAll(searchTerm === "");
  }, [updateTable, searchTerm]);

  const [selectItemNum, setSelectItemNum] = useState(10);
  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const nPage = Math.ceil(
    (showAll ? brands.length : searchedBrands.length) / selectItemNum
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
      (showAll ? brands.length : searchedBrands.length) / selectItemNum
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
        <Link to="/brands/add-brand" className="btnLink">
          <Addpropertybtn buttonText={"ADD NEW"} />
        </Link>
        <div className="table-box">
          <div className="table-top-box">Brands Module</div>
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
                  <Th>Description</Th>

                  <Th>Edit</Th>
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
                  brands
                    .slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    )
                    .map((brand) => (
                      <Tr key={brand._id} id={brand._id}>
                        <Td>{brand.name.toUpperCase()}</Td>
                        <Td className="tableDescription">
                          {(brand.description?.length > 50
                            ? brand.description.substring(0, 50) + "..."
                            : brand.description) || "Empty"}
                        </Td>

                        <Td>
                          <Link to={`/brands/edit-brand/${brand._id}`}>
                            <AiFillEdit
                              style={{ fontSize: "22px", cursor: "pointer" }}
                            />
                          </Link>
                        </Td>
                        <Td>
                          <Delete
                            handleFunction={() => handleDeleteBrands(brand._id)}
                          />
                        </Td>
                      </Tr>
                    ))
                ) : searchedBrands.length > 0 ? (
                  searchedBrands
                    .slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    )
                    .map((brand) => (
                      <Tr key={brand._id} id={brand._id}>
                        <Td>{brand.name}</Td>
                        <Td className="tableDescription">
                          {(brand?.description?.length > 50
                            ? brand?.description.substring(0, 50) + "..."
                            : brand?.description) || "Empty"}
                        </Td>

                        <Td>
                          <Link to={`/brands/edit-brand/${brand._id}`}>
                            <AiFillEdit
                              style={{ fontSize: "22px", cursor: "pointer" }}
                            />
                          </Link>
                        </Td>
                        <Td>
                          <Delete
                            handleFunction={() => handleDeleteBrands(brand._id)}
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
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div style={{ width: "110px" }}>
                {firstIndex + 1} -{" "}
                {showAll
                  ? brands.slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    ).length + firstIndex
                  : searchedBrands?.slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    ).length + firstIndex}{" "}
                of {showAll ? brands?.length : searchedBrands.length}
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
};

export default Brands;
