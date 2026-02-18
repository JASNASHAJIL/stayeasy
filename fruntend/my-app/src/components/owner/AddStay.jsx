import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function AddStay() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("any");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    let files = Array.from(e.target.files).filter(Boolean);
    if (files.length > 10) {
      alert("You can upload a maximum of 10 images.");
      files = files.slice(0, 10); // Keep only the first 10 files
    }
    setImages(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images.length) return alert("Please upload at least one image of the property.");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user.token;
    if (!token) return alert("You must be logged in as an owner to add a stay");
      
    const formData = new FormData();
    formData.append("title", title);
    formData.append("rent", rent);
    formData.append("type", type);
    formData.append("address", address);
    formData.append("gender", gender);
    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);
      const res = await API.post("/stay", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(res.data.message || "Stay added successfully");
      navigate("/dashboard");

      // Reset form
      setTitle(""); setRent(""); setType(""); setAddress(""); setGender("any"); setImages([]); setPreviews([]);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || (err.code === "ERR_NETWORK" ? "Server is offline. Please start the backend." : "Error uploading stay");
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>List a New Property</h2>
        <p style={styles.subtitle}>Fill in the details to get your property listed on StayEase.</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input style={styles.input} type="text" placeholder="Property Title (e.g., 'Cozy 1BHK near Campus')" value={title} onChange={e => setTitle(e.target.value)} required />
          <div style={styles.inputGroup}>
            <input style={styles.input} type="number" placeholder="Monthly Rent (₹)" value={rent} onChange={e => setRent(e.target.value)} required />
            <input style={styles.input} type="text" placeholder="Property Type (e.g., 'Apartment', 'PG')" value={type} onChange={e => setType(e.target.value)} required />
          </div>
          <textarea style={styles.textarea} placeholder="Full Address" value={address} onChange={e => setAddress(e.target.value)} required />
          
          <div style={styles.inputGroup}>
            <div style={{flex: 1}}>
              <label style={styles.label}>Preferred Tenant</label>
              <select style={styles.select} value={gender} onChange={e => setGender(e.target.value)}>
                <option value="any">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label style={styles.label}>Upload Images</label>
            <input style={styles.input} type="file" multiple accept="image/*" onChange={handleFileChange} />
          </div>

          {previews.length > 0 && (
            <div style={styles.previewContainer}>
              {previews.map((src, idx) => (
                <img key={idx} src={src} alt={`preview-${idx}`} style={styles.previewImage} />
              ))}
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Submitting..." : "Add Property"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '40px 20px',
    background: '#f7f9fc',
    minHeight: '100vh',
    fontFamily: 'Inter, sans-serif',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '600px',
    padding: '30px 40px',
  },
  title: {
    textAlign: 'center',
    color: '#1a202c',
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '8px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#718096',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    fontFamily: 'Inter, sans-serif',
    minHeight: '80px',
    resize: 'vertical',
  },
  inputGroup: {
    display: 'flex',
    gap: '20px',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    background: '#fff',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '6px',
    display: 'block',
  },
  previewContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '10px',
  },
  previewImage: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover',
    border: '2px solid #e2e8f0',
  },
  button: {
    padding: '14px',
    background: '#4A90E2',
    color: '#fff',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginTop: '10px',
    transition: 'background-color 0.2s',
  },
};
