import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './SellerHomePage.css';

export const SellerHomePage = () => {
        const memberId = localStorage.getItem("id");
        const memberName = localStorage.getItem("name");
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedItem, setSelectedItem] = useState(null);
        const [totalProfits, setTotalProfits] = useState(0); // calculating profits


        const navigate = useNavigate()

        const [items, setItems] = useState([])

        const [item, addItem] = useState({
          item_name: "",
          item_condition: "",
          size: "",
          description: "",
          price: "",
          item_photo: "",
          member_id: memberId // Automatically add member_id to the item object
        });
        
        const handleChange = (e) => {
          const { name, value } = e.target;
          addItem(prev => ({ ...prev, [name]: value }));
      };
      
      const handleDelete = async (itemId) => {
        try{
          await axios.delete(`http://localhost:8800/items/${itemId}`)
          window.location.reload()
        } catch(err){
          console.log(err)
        }
      }

      const handleModify = (itemId) => {
        const itemToModify = items.find(item => item.item_id === itemId);
        setSelectedItem(itemToModify);
        setIsModalOpen(true);
      };

      const handleUpdate = async () => {
        try {
          await axios.put(`http://localhost:8800/items/${selectedItem.item_id}`, selectedItem);
          setIsModalOpen(false); // Close the modal after successful update
          window.location.reload(); // Reload to show updated data
        } catch (err) {
          console.log("Error updating item:", err);
        }
      };
      
      
      const handleClick = async (e) => {
        e.preventDefault();
        try {
          await axios.post("http://localhost:8800/items", item);
          navigate(0); // Refresh the page after adding the item
        } catch (err) {
          console.log(err);
        }
        }

        console.log(item);

        useEffect(() => {
          const fetchItems = async () => {
              if (!memberId) {
                  alert("You must be logged in to view your items.");
                  navigate("/login"); // Redirect to login if no member_id
                  return;
              }
  
              try {
                  // Call the backend API with member_id in the query params
                  const res = await axios.get(`http://localhost:8800/items/member?member_id=${memberId}`);
                  setItems(res.data); // Update state with the fetched items
              } catch (err) {
                  console.error("Error fetching items:", err);
                  alert("There was an error loading your items.");
              }
          };
  
          fetchItems(); // Trigger the fetch when the component mounts
      }, [memberId, navigate]);
      
      // calculating funds
      useEffect(() => {
        const fetchProfits = async () => {
            try {
                // First check the orders
                const ordersCheck = await axios.get(`http://localhost:8800/check-orders/${memberId}`);
                console.log("Orders check:", ordersCheck.data);
    
                const res = await axios.get(`http://localhost:8800/profits/seller/${memberId}`);
                console.log("Profits response:", res.data);
                setTotalProfits(res.data.total || 0);
            } catch (err) {
                console.error("Error fetching profits:", err);
            }
        };
        fetchProfits();
    }, [memberId]);

  return (
    // Seller title
    <div className="sellerpage-container">
      <h1 className="sellerpage-title">Welcome to the Seller's portal, {memberName}!</h1>
      <div className="profit-container">
          <h2 className="profit-title">Total Profits: ${totalProfits.toFixed(2)}</h2>
      </div>
      <div className="order-container">
      <button className="checkorders">
        <Link to="/seller-orders">Check Orders</Link>
      </button>
      <button className="back-button">
                <Link to="/">Logout</Link>
            </button>
      </div>
      
      {/*Display Items */}
      <div className ="sellerpage-left">
      <div className="item-grid">
          {items.map((item, index)=>(
            <div className="item-single" key={item.item_id || index}>
              {item.item_photo && (
                <img src={item.item_photo} alt={item.item_name} />
              )}
              <h2>{item.item_name}</h2>
              <div className="item-details-inline">
              <p>${item.price}</p>
              <p>Size: {item.size}</p>
            </div>  
            <button onClick={()=>handleModify(item.item_id)}>Modify</button>
            <button onClick={()=>handleDelete(item.item_id)}>Delete</button>
            </div>
          ))}
        </div>
        </div>

 {/* Add Item Form */}
 <div className="sellerpage-right">
                <h1 className="add-item-title">Add New Item</h1>
                <form className="seller-form">
                    {/* Item Name */}
                    <h2 className= "add-labels"> Item Name:</h2>
                    <input
                        type="text"
                        name="item_name"
                        placeholder="Item Name"
                        value={item.item_name}
                        onChange={handleChange}
                    />

                    {/* Item Condition */}
                    <div>
                    <h2 className= "add-labels"> Condition:</h2>
                        <div>
                            <input
                                type="radio"
                                name="item_condition"
                                value="New"
                                onChange={handleChange}
                            />
                            <label>New</label>
                            <input
                                type="radio"
                                name="item_condition"
                                value="Used-Barely Worn"
                                onChange={handleChange}
                            />
                            <label>Used - Barely Worn</label>
                            <input
                                type="radio"
                                name="item_condition"
                                value="Used-Old"
                                onChange={handleChange}
                            />
                            <label>Used - Old</label>
                        </div>
                    </div>

                    {/* Size */}
                    <div>
                    <h2 className= "add-labels"> Size:</h2>
                    <input
                        type="text"
                        name="size"
                        placeholder="Size (ex. S, M, L)"
                        value={item.size}
                        onChange={handleChange}
                    />
                    </div>
                    {/* Description */}
                    <h2 className= "add-labels"> Description:</h2>

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={item.description}
                        onChange={handleChange}
                    />

                    {/* Price */}
                    <h2 className= "add-labels"> Price:</h2>

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={item.price}
                        onChange={handleChange}
                    />

                    {/* Item Photo URL */}
                    <h2 className= "add-labels"> Item Photo:</h2>

                    <input
                        type="text"
                        name="item_photo"
                        placeholder="Item Photo URL"
                        value={item.item_photo}
                        onChange={handleChange}
                    />

                    {/* Submit Button */}
                    <button className= "add" onClick={handleClick}>Add Item</button>
                </form>
            </div>

             {/* Modal for modifying item */}
  {isModalOpen && selectedItem && (
    <div className="modal">
      <div className="modal-content">
       <h2 className= "add-labels"> Modify Items</h2>
       <h2 className= "add-labels"> Item Name:</h2>
        <input
          type="text"
          name="item_name"
          value={selectedItem.item_name}
          onChange={(e) => setSelectedItem({ ...selectedItem, item_name: e.target.value })}
          placeholder="Item Name"
        />
      <h2 className="add-labels">Condition:</h2>
<div>
  <input
    type="radio"
    name="item_condition"
    value="New"
    checked={selectedItem.item_condition === 'New'}
    onChange={(e) => setSelectedItem({ ...selectedItem, item_condition: e.target.value })}
  />
  <label>New</label>
  <input
    type="radio"
    name="item_condition"
    value="Used-Barely Worn"
    checked={selectedItem.item_condition === 'Used - Barely Worn'}
    onChange={(e) => setSelectedItem({ ...selectedItem, item_condition: e.target.value })}
  />
  <label>Used - Barely Worn</label>
  <input
    type="radio"
    name="item_condition"
    value="Used-Old"
    checked={selectedItem.item_condition === 'Used - Old'}
    onChange={(e) => setSelectedItem({ ...selectedItem, item_condition: e.target.value })}
  />
  <label>Used - Old</label>
</div>

        <h2 className= "add-labels"> Item Price:</h2>
        <input
          type="number"
          name="price"
          value={selectedItem.price}
          onChange={(e) => setSelectedItem({ ...selectedItem, price: e.target.value })}
          placeholder="Price"
        />
        <h2 className= "add-labels"> Item Size:</h2>
        <input
                        type="text"
                        name="size"
                        value={selectedItem.size}
                        onChange={(e) => setSelectedItem({ ...selectedItem, size: e.target.value })}
                        placeholder="Size (ex. S, M, L)"
                    />

        <h2 className= "add-labels"> Description:</h2>
        <textarea
          name="description"
          value={selectedItem.description}
          onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
          placeholder="Description"
        />
         <h2 className= "add-labels"> Item Photo:</h2>

<input
    type="text"
    name="item_photo"
    value={selectedItem.item_photo}
    onChange={(e) => setSelectedItem({ ...selectedItem, item_photo: e.target.value })}
    placeholder="Item Photo URL"
/>

        <button onClick={handleUpdate}>Save Changes</button>
        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
      </div>
    </div>
  )}
</div> 
  )
}