import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function Home() {
    const [show, setShow] = useState(false);
    const [personnes, setPersonnes] = useState([]);
    const [products ,  setProducts ] = useState([]);
    const [formData, setFormData] = useState({
        emplacement_id: '',
        name: '',
        qte: 0,
        produit_id: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [searchTermProduct, setSearchTermProduct] = useState('');
    const [searchTermEmplacement, setSearchTermEmplacement] = useState('');

    useEffect(() => {
        fetchPersonnes();
        fetchProducts();
    }, []);
    
    const fetchPersonnes = async () => {
    try {
        const response = await axios.get('http://localhost:4000/emplacements');
        if (response.data && Array.isArray(response.data)) {
            const updatedData = response.data.map((produit) => {
                if (!produit.product) {
                    produit.product = { name: 'empty' };
                }
                return produit;
            });
            setPersonnes(updatedData);
            console.log("Fetched data:", updatedData);
        } else {
            setPersonnes([]);
        }
    } catch (error) {
        console.error('Error fetching personnes:', error);
    }
};

const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:4000/products');
            if (response.data && Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

  

    const handleClose = () => {
        setShow(false);
        setFormData({
        emplacement_id: '',
        name: '',
        qte: 0,
        produit_id:0
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form data:', formData);
        try {
            if (isEditing) {
                await axios.put(`http://localhost:4000/emplacements/${formData.emplacement_id}`, {
                    name: formData.name,
                    qte: formData.qte,
                    productId: formData.produit_id
                });
                console.log(formData);
                console.log("Updated product");
            }
            handleClose();
            fetchPersonnes();
        } catch (error) {
            console.error('Error saving produit:', error);
            alert('Error saving produit');
        }
    };

    const handleEdit = (produit) => {
        console.log('Editing produit:', produit);
        setIsEditing(true);
        setFormData({
            emplacement_id: produit.id,
            name: produit.name,
            produit_id : produit.id,
            qte : produit.qte
        });
        setShow(true);
    };

    const handleSearchChangeProduct = (e) => {
        setSearchTermProduct(e.target.value);
    };

    const handleSearchChangeEmplacement = (e) => {
        setSearchTermEmplacement(e.target.value);
    };

    const filteredPersonnes = personnes.filter(produit =>
        (produit.product && produit.product.name && produit.product.name.toLowerCase().includes(searchTermProduct.toLowerCase())) &&
        produit.name.toLowerCase().includes(searchTermEmplacement.toLowerCase())
    );

    return (
        <div className="container">
            <div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded">
                <div className="row">
                    <div className="col-sm-3 mt-5 mb-4 text-gred">
                        <div className="search">
                            <form className="form-inline">
                                <input
                                    className="form-control mr-sm-2"
                                    type="search"
                                    placeholder="Search produits"
                                    aria-label="Search"
                                    value={searchTermProduct}
                                    onChange={handleSearchChangeProduct}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="col-sm-3 mt-5 mb-4 text-gred">
                        <div className="search">
                            <form className="form-inline">
                                <input
                                    className="form-control mr-sm-2"
                                    type="search"
                                    placeholder="Search emplacements"
                                    aria-label="Search"
                                    value={searchTermEmplacement}
                                    onChange={handleSearchChangeEmplacement}
                                />
                            </form>
                        </div>
                    </div>
                 
                    <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{ color: "green" }}>
                        <h2><b>Stock</b></h2>
                    </div>
                </div>
                <div className="row">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nom Emplacement</th>
                                    <th>Nom Produit </th>
                                    <th>quantite</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPersonnes.map((produit, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{produit.name}</td>
                                        <td>{produit.product && produit.product.name ? produit.product.name : ''}</td>
                                        <td>{produit.qte}</td>
                                        <td>
                                            <a href="#" className="edit" title="Edit" data-toggle="tooltip" onClick={() => handleEdit(produit)}>
                                                <i className="material-icons">&#xE254;</i>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="model_box">
                    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEditing ? "Edit Record" : "Add Record"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formName">
                                    <Form.Label>Nom emplacement :</Form.Label>
                                    <Form.Control type="text" placeholder="" name="name" value={formData.name} onChange={handleChange} readOnly  />
                                </Form.Group>
                                <Form.Group controlId="formProduit">
                                    <Form.Label>Product</Form.Label>
                                    <Form.Control as="select" name="produit_id" onChange={handleChange}>
                                        <option value="">Select product</option>
                                        {products.map((produit, index) => (
                                            <option key={index} value={produit.id}>{produit.name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formQte">
                                    <Form.Label>Quantite produit :</Form.Label>
                                    <Form.Control type="text" placeholder="" name="qte" value={formData.qte} onChange={handleChange}   />
                                </Form.Group>
                                <br />
                                <Button variant="primary" type="submit">
                                    {isEditing ? "Update Record" : "Add Record"}
                                </Button>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Home;
