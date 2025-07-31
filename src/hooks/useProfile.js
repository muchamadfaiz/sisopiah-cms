import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserProfile } from "redux/features/auth";
import { message } from "antd";

const useProfile = (filters) => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const getProfile = async () => {
    try {
      const response = await dispatch(getUserProfile()).unwrap();
      setRole(response.data.user.role_id);
      setUser(response.data.user);
      setCompany(response.data.user.perusahaan);
      getData({ ...filters, perusahaan: response.data.user.perusahaan });
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []); // Optionally pass filters if they change dynamically

  return { role, user, company, loading };
};

export default useProfile;
