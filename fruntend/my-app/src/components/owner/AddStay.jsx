import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import API from "../../api";

export default function AddStay() {
  const navigate = useNavigate(); // ✅ define navigate here
  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files).filter(Boolean));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images.length) return alert("Upload at least one image");
    if (isNaN(lat) || isNaN(lng)) return alert("Latitude and Longitude must be numbers");

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) return alert("You must be logged in to add a stay");
      
    const formData = new FormData();
    formData.append("title", title);
    formData.append("rent", rent);
    formData.append("type", type);
    formData.append("address", address);
    formData.append("lat", lat);
    formData.append("lng", lng);
    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);
      const res = await API.post("/owner/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(res.data.message || "Stay added successfully");
      navigate("/dashboard"); // ✅ now navigate works

      // Reset form
      setTitle(""); setRent(""); setType(""); setAddress(""); setLat(""); setLng(""); setImages([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error uploading stay");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#1e3a8a" }}>Add New Stay</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="number" placeholder="Rent" value={rent} onChange={e => setRent(e.target.value)} required />
        <input type="text" placeholder="Type" value={type} onChange={e => setType(e.target.value)} required />
        <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />
        <input type="text" placeholder="Latitude" value={lat} onChange={e => setLat(e.target.value)} required />
        <input type="text" placeholder="Longitude" value={lng} onChange={e => setLng(e.target.value)} required />
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />

        {images.length > 0 && (
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {images.map((img, idx) => (
              <img key={idx} src={URL.createObjectURL(img)} alt={`preview-${idx}`} style={{ width: "50px", height: "50px", borderRadius: "5px", objectFit: "cover" }} />
            ))}
          </div>
        )}

        <button type="submit" disabled={loading} style={{ padding: "10px", background: "#0f172a", color: "#fff", borderRadius: "5px", cursor: "pointer" }}>
          {loading ? "Uploading..." : "Add Stay"}
        </button>
      </form>
    </div>
  );
}
