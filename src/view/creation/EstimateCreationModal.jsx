import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  FormControl,
  Table,
} from "react-bootstrap";
import { FaTimes, FaPlus } from "react-icons/fa";
import { BsGearWideConnected } from "react-icons/bs";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  fetchParties,
  createEstimate,
  updateEstimate,
  searchEstimates,
} from "../../slice/estimateSlice";
import {
  TextInputform,
  TextArea,
  DropDown,
  Calender,
  CheckBox,
} from "../../components/Forms";
import NotifyData from "../../components/NotifyData";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "./EstimateCreationModal.css"
import { fetchCategories } from "../../slice/CategorySlice";
import { fetchProducts } from "../../slice/ProductSlice";
import PartyModal from "../creation/PartyModalCreation";
import AddItem from "../creation/ItemModalCreation";
import { fetchUnits } from "../../slice/UnitSlice";
import { BsX } from "react-icons/bs";
import axiosInstance from "../../config/API";

// Static options
const PRICE_UNIT_TYPES = ["Without Tax", "With Tax"];
const TAX_OPTIONS = [
  { value: "", label: "Select" },
  { value: 0, label: "0%" },
  { value: 5, label: "5%" },
  { value: 12, label: "12%" },
  { value: 18, label: "18%" },
  { value: 28, label: "28%" },
];
const STATE_OF_SUPPLY_OPTIONS = [
  { value: "", label: "Select" },
  { value: "AndraPradesh", label: "AndraPradesh" },
  { value: "Kerala", label: "Kerala" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Maharastra", label: "Maharastra" },
  { value: "Delhi", label: "Delhi" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "punjab", label: "punjab" },
  { value: "bihar", label: "bihar" },
];
const PAYMENT_OPTIONS = [
  { value: "", label: "Select Payment Type" },
  { value: "check", label: "Check" },
  { value: "Cash", label: "Cash" },
];

const generateUniqueId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const INITIAL_ROW = {
  id: generateUniqueId(),
  product_id: "",
  product_name: "",
  category: "",
  Description: "",
  hsn_code: "",
  qty: "",
  unit: "NONE",
  priceUnitType: "Without Tax",
  price: "",
  discountPercent: "",
  discountAmount: "0.00",
  taxPercent: 0,
  taxAmount: "0.00",
  amount: "0.00",
};

const EstimateCreation = ({ tabNumber = 1 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // ============== TAB FUNCTIONALITY START ==============
  // Multiple Tabs State
  const [tabs, setTabs] = useState([
    { id: 1, title: "Estimate#1", active: true }
  ]);
  const [nextTabId, setNextTabId] = useState(2);
  const [availableTabIds, setAvailableTabIds] = useState([]);
  // Store form data for each tab
  const [tabForms, setTabForms] = useState({});
  // ============== TAB FUNCTIONALITY END ==============
  
  const { id } = useParams();
  const location = useLocation();
  const [selectedPartyOption, setSelectedPartyOption] = useState(null);
  
  // FIXED: Correct Redux selector structure
  const estimateState = useSelector((state) => state.estimate);
  const { parties = [], partiesStatus = "idle", estimates = [] } = estimateState || {};
  
  const categoryState = useSelector((state) => state.category);
  const { categories = [], status: categoryStatus = "idle" } = categoryState || {};
  
  const productState = useSelector((state) => state.product);
  const { products = [], status: productStatus = "idle" } = productState || {};
  
  const unitState = useSelector((state) => state.unit);
  const { units = [], status: unitStatus = "idle" } = unitState || {};
  
  const isEditMode = location.pathname.startsWith("/estimate/edit");
  const isViewMode = location.pathname.startsWith("/estimate/view");
  const isCreateMode = location.pathname === "/estimate/create";
  const isDisabled = isViewMode;
  const [imagePreview, setImagePreview] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [attachedDocs, setAttachedDocs] = useState([]);
  
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [partyForm, setPartyForm] = useState({
    name: "",
    phone: "",
    gstin: "",
    email: "",
    state_of_supply: "",
    billing_address: "",
    shipping_address: "",
    amount: 0,
    transaction_type: "to receive",
    additional_field: "[]",
    creditlimit: 0,
    gstin_type_id: "",
    gstin_type_name: "",
  });
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const handleOpenPartyModal = () => setShowPartyModal(true);
  const handleClosePartyModal = () => setShowPartyModal(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [enableItem, setEnableItem] = useState(true);
  const [autoFillReceived, setAutoFillReceived] = useState(false);
  const [showProductTable, setShowProductTable] = useState(false);
  const [hasUserUploadedImage, setHasUserUploadedImage] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [credit, setCredit] = useState(true);
  const [customers, setCustomers] = useState([
    { value: "", label: "Select Party" },
  ]);
  const [isManualRoundOff, setIsManualRoundOff] = useState(false);
  const estimateToEdit = id ? estimates.find((e) => e.estimate_id == id) : null;
  const [firstEstimateNo, setFirstEstimateNo] = useState(null);
  
  const [formData, setFormData] = useState({
    parties_id: "",
    name: "",
    phone: "",
    billing_address: "",
    shipping_address: "",
    estimate_no: "", 
    estimate_date: new Date().toISOString().split("T")[0], 
    state_of_supply: "",
    payment_type: "",
    description: "",
    add_image: "",
    rows: [INITIAL_ROW],
    round_off: 0,
    round_off_amount: "0",
    total: "0.00",
    received_amount: " ",
    visibleColumns: {
      category: false,
      description: false,
      hsn_code: false,
      discount: false,
    },
  });

  // // ============== DEBUGGING ==============
  // useEffect(() => {
  //   console.log("=== REDUX STATE DEBUG ===");
  //   console.log("Products:", products);
  //   console.log("Categories:", categories);
  //   console.log("Parties:", parties);
  //   console.log("Units:", units);
  //   console.log("Product Status:", productStatus);
  //   console.log("Category Status:", categoryStatus);
  //   console.log("=== END DEBUG ===");
  // }, [products, categories, parties, units, productStatus, categoryStatus]);

  // ============== TAB FUNCTIONS START ==============
  const addNewTab = () => {
    let newTabId;
    
    // Check if we have available (reusable) tab IDs
    if (availableTabIds.length > 0) {
      // Use the smallest available ID (for proper ordering)
      newTabId = availableTabIds[0];
      
      // Remove this ID from available list
      setAvailableTabIds(prev => prev.filter(id => id !== newTabId));
    } else {
      // No reusable IDs, use next sequential ID
      newTabId = nextTabId;
      setNextTabId(prev => prev + 1);
    }
    
    const allEstimateNumbers = [];
    
    Object.values(tabForms).forEach(tabForm => {
      if (tabForm.estimate_no) {
        allEstimateNumbers.push(tabForm.estimate_no);
      }
    });
    
    // Add current active tab's invoice number
    if (formData.estimate_no && formData.estimate_no !== "Generating...") {
      allEstimateNumbers.push(formData.estimate_no);
    }
    
    const currentYearMonth = "EST" + new Date().toISOString().slice(0, 7).replace(/-/g, "");
    
    let nextEstimateNumber = "0001";
    
    if (allEstimateNumbers.length > 0) {
      const currentMonthEstimates = allEstimateNumbers.filter(est => 
        est?.startsWith(currentYearMonth)
      );
      
      if (currentMonthEstimates.length > 0) {
        const numbers = currentMonthEstimates.map((est) => {
          const numPart = est.split("-")[1];
          return parseInt(numPart || "0");
        });
        const maxNum = Math.max(...numbers);
        nextEstimateNumber = String(maxNum + 1).padStart(4, "0");
      }
    }
    
    const nextEstimateNo = `${currentYearMonth}-${nextEstimateNumber}`;
    
    // Create COMPLETELY NEW form data for the new tab
    const newFormData = {
      parties_id: "",
      name: "",
      phone: "",
      billing_address: "",
      shipping_address: "",
      estimate_no: nextEstimateNo, 
      estimate_date: new Date().toISOString().split("T")[0], 
      state_of_supply: "",
      payment_type: "",
      description: "",
      add_image: "",
      rows: [{ ...INITIAL_ROW, id: generateUniqueId() }],
      round_off: 0,
      round_off_amount: "0",
      total: "0.00",
      received_amount: " ",
      visibleColumns: {
        category: false,
        description: false,
        hsn_code: false,
        discount: false,
      },
    };
    
    // Save current tab's form data before switching
    const activeTab = tabs.find(tab => tab.active);
    if (activeTab) {
      setTabForms(prev => ({
        ...prev,
        [activeTab.id]: {
          ...formData,
          _selectedPartyOption: selectedPartyOption,
          _imagePreview: imagePreview,
          _attachedDocs: attachedDocs,
          _autoFillReceived: autoFillReceived,
          _credit: credit,
        }
      }));
    }
    
    // Save new tab's form data
    setTabForms(prev => ({
      ...prev,
      [newTabId]: newFormData
    }));
    
    // Update tabs
   setTabs(prev => [
      ...prev.map(tab => ({ ...tab, active: false })),
      { id: newTabId, title: `Estimate#${newTabId}`, active: true }
    ]);
    
    // Set the new form data
    setFormData(newFormData);
    
    // RESET ALL SHARED STATES for new tab
    setSelectedPartyOption(null);
    setImagePreview("");
    setImageFileName("");
    setAttachedDocs([]);
    setHasUserUploadedImage(false);
    setAutoFillReceived(false);
    setShowProductTable(false);
    setCredit(true);
    setIsManualRoundOff(false);
  };

  const switchTab = (tabId) => {
    // Save current tab's form data with all associated states
    const activeTab = tabs.find(tab => tab.active);
    if (activeTab) {
      setTabForms(prev => ({
        ...prev,
        [activeTab.id]: {
          ...formData,
          _selectedPartyOption: selectedPartyOption,
          _imagePreview: imagePreview,
          _attachedDocs: attachedDocs,
          _autoFillReceived: autoFillReceived,
          _credit: credit,
          _isManualRoundOff: isManualRoundOff,
        }
      }));
    }
    
    // Update tabs
    setTabs(prev => prev.map(tab => ({
      ...tab,
      active: tab.id === tabId
    })));
    
    // Load the form data for the selected tab
    const savedTabData = tabForms[tabId];
    if (savedTabData) {
      // Load main form data (excluding underscore prefixed fields)
      const { 
        _selectedPartyOption, 
        _imagePreview, 
        _attachedDocs, 
        _autoFillReceived, 
        _credit,
        _isManualRoundOff,
        ...formDataToLoad 
      } = savedTabData;
      
      setFormData(formDataToLoad);
      
      // Load associated states
      setSelectedPartyOption(_selectedPartyOption || null);
      setImagePreview(_imagePreview || "");
      setAttachedDocs(_attachedDocs || []);
      setAutoFillReceived(_autoFillReceived || false);
      setCredit(_credit !== undefined ? _credit : true);
      setIsManualRoundOff(_isManualRoundOff || false);
      setImageFileName("");
      setHasUserUploadedImage(false);
      setShowProductTable(false);
    }
  };

  const closeTab = (tabId) => {
    if (tabs.length === 1) return;
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    const isClosingActiveTab = tabs.find(tab => tab.id === tabId)?.active;
    
    // Add the closed tab ID to available IDs (for reuse)
    setAvailableTabIds(prev => [...prev, tabId].sort((a, b) => a - b));
    
    // Remove the tab's form data
    setTabForms(prev => {
      const newTabForms = { ...prev };
      delete newTabForms[tabId];
      return newTabForms;
    });
    
    // If the closed tab was active, activate another tab
    if (isClosingActiveTab && newTabs.length > 0) {
      const lastTab = newTabs[newTabs.length - 1];
      newTabs[newTabs.length - 1].active = true;
      
      // Load the activated tab's form data
      const savedTabData = tabForms[lastTab.id];
      if (savedTabData) {
        const { 
          _selectedPartyOption, 
          _imagePreview, 
          _attachedDocs, 
          _autoFillReceived, 
          _credit,
          _isManualRoundOff,
          ...formDataToLoad 
        } = savedTabData;
        
        setFormData(formDataToLoad);
        
        // Load associated states
        setSelectedPartyOption(_selectedPartyOption || null);
        setImagePreview(_imagePreview || "");
        setAttachedDocs(_attachedDocs || []);
        setAutoFillReceived(_autoFillReceived || false);
        setCredit(_credit !== undefined ? _credit : true);
        setIsManualRoundOff(_isManualRoundOff || false);
        setImageFileName("");
        setHasUserUploadedImage(false);
        setShowProductTable(false);
      }
    }
    
    setTabs(newTabs);
  };
  // ============== TAB FUNCTIONS END ==============

  // Initialize column visibility from saved data
  useEffect(() => {
    if (estimateToEdit) {
      let itemsArray = [];
      try {
        itemsArray = JSON.parse(estimateToEdit.products || "[]");
      } catch (e) {
        console.error("Failed to parse products JSON", e);
        itemsArray = [];
      }
      
      // SAFE CHECK: Always use String() wrapper
      const hasCategory = itemsArray.some(item => 
        item && item.category && String(item.category).trim() !== ""
      );
      const hasDescription = itemsArray.some(item => 
        item && item.Description && String(item.Description).trim() !== ""
      );
      const hasHsn = itemsArray.some(item => 
        item && item.hsn_code && String(item.hsn_code).trim() !== ""
      );
      const hasDiscount = itemsArray.some(item => 
        item && item.discountPercent && parseFloat(item.discountPercent) > 0
      );

      setFormData(prev => ({
        ...prev,
        visibleColumns: {
          category: hasCategory,
          description: hasDescription,
          hsn_code: hasHsn,
          discount: hasDiscount,
        }
      }));
    }
  }, [estimateToEdit]);

  // Generate invoice number in create mode
  useEffect(() => {
    if (isCreateMode) {
      dispatch(searchEstimates("")).then((action) => {
        if (action.payload && action.payload.length > 0) {
          const allEstimates = action.payload.map((estimate) => estimate.estimate_no);
          const currentYearMonth =
            "EST" + new Date().toISOString().slice(0, 7).replace(/-/g, "");

          const currentMonthEstimates = allEstimates.filter((est) =>
            est?.startsWith(currentYearMonth)
          );

          let nextNum = 1;
          if (currentMonthEstimates.length > 0) {
            const numbers = currentMonthEstimates.map((est) => {
              const numPart = est.split("-")[1];
              return parseInt(numPart || "0");
            });
            const maxNum = Math.max(...numbers);
            nextNum = maxNum + 1;
          }

          const nextEstimateNo = `${currentYearMonth}-${String(nextNum).padStart(
            4,
            "0"
          )}`;

          setFormData((prev) => ({
            ...prev,
            estimate_no: nextEstimateNo,
          }));
          
          // Also save to tabForms for the first tab
          setTabForms(prev => ({
            ...prev,
            1: { 
              ...prev[1], 
              estimate_no: nextEstimateNo,
              _selectedPartyOption: selectedPartyOption,
              _imagePreview: imagePreview,
              _attachedDocs: attachedDocs,
              _autoFillReceived: autoFillReceived,
              _credit: credit,
              _isManualRoundOff: isManualRoundOff,
            }
          }));
        } else {
          const currentYearMonth =
            "EST" + new Date().toISOString().slice(0, 7).replace(/-/g, "");
          const firstEstimate = currentYearMonth + "-0001";
          setFirstEstimateNo(firstEstimate);
          setFormData((prev) => ({
            ...prev,
            estimate_no: firstEstimate,
          }));
          
          // Also save to tabForms for the first tab
          setTabForms(prev => ({
            ...prev,
            1: { 
              ...prev[1], 
              estimate_no: firstEstimate,
              _selectedPartyOption: selectedPartyOption,
              _imagePreview: imagePreview,
              _attachedDocs: attachedDocs,
              _autoFillReceived: autoFillReceived,
              _credit: credit,
              _isManualRoundOff: isManualRoundOff,
            }
          }));
        }
      });
    }
  }, [isCreateMode, dispatch]);

  // FIXED: Fetch categories with proper dependency
  useEffect(() => {
    if (categoryStatus === "idle") {
      console.log("Fetching categories...");
      dispatch(fetchCategories());
    }
  }, [categoryStatus, dispatch]);

  // FIXED: Fetch products with proper dependency
  useEffect(() => {
    if (productStatus === "idle") {
      console.log("Fetching products...");
      dispatch(fetchProducts(""));
    }
  }, [productStatus, dispatch]);

  // Fetch parties on mount
  useEffect(() => {
    if (partiesStatus === "idle") {
      console.log("Fetching parties...");
      dispatch(fetchParties());
    }
  }, [partiesStatus, dispatch]);

  // Fetch units on mount
  useEffect(() => {
    if (unitStatus === "idle") {
      console.log("Fetching units...");
      dispatch(fetchUnits());
    }
  }, [unitStatus, dispatch]);

  // Fetch estimates for edit/view
  useEffect(() => {
    if ((isEditMode || isViewMode) && estimates.length === 0) {
      dispatch(searchEstimates(""));
    }
  }, [isEditMode, isViewMode, estimates.length, dispatch]);

  // Update customers options
  useEffect(() => {
    if (parties && Array.isArray(parties)) {
      console.log("Updating customer options from parties:", parties);
      const customerOptions = parties.map((p) => ({
        value: p.id || p.parties_id || "",
        label: p.name || "Unnamed Party",
      }));
      setCustomers([
        { value: "", label: "Select Party" },
        { value: "add_party", label: "+ Add Party" },
        ...customerOptions,
      ]);
    }
  }, [parties]);

  useEffect(() => {
    if (isCreateMode) {
      setImagePreview("");
      setImageFileName("");
      setAttachedDocs([]);
      setHasUserUploadedImage(false);
      // Reset auto-fill checkbox in create mode
      setAutoFillReceived(false);
    }
  }, [isCreateMode]);

  // FIXED: Product options with better error handling
  const productOptions = React.useMemo(() => {
    console.log("Generating product options from:", products);
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      console.log("No products available");
      return [];
    }
    
    return products.map((p) => {
      let salePrice = "0";
      try {
        const sp = JSON.parse(p.sale_price || "{}");
        salePrice = sp.price || "0";
      } catch (e) {
        console.error("Error parsing sale_price for product:", p.product_name, e);
      }

      return {
        value: p.product_name || p.name || "",
        label: `${p.product_name || p.name || ""} - ₹${salePrice}`,
        product_id: p.product_id || p.id || "",
        hsn_code: p.hsn_code || "",
        salePrice: salePrice,
        category: p.category_name || p.category || "",
        unit_value: p.unit_value || "NONE",
      };
    }).filter(option => option.value); // Filter out empty options
  }, [products]);

  // FIXED: Unit options with better handling
  const unitOptions = React.useMemo(() => {
    console.log("Generating unit options from:", units);
    
    // Start with "NONE" option
    const options = [{ value: "NONE", label: "NONE" }];

    // Filter active units (delete_at = 0) from your database
    const activeUnits = units.filter((unit) => unit.delete_at === 0);

    // Add each active unit to options
    activeUnits.forEach((unit) => {
      if (unit.unit_name) {
        options.push({
          value: unit.unit_name,
          label: unit.unit_name,
        });
      }
    });

    return options;
  }, [units]);

  // FIXED: Category options with better handling
  const categoryOptions = React.useMemo(() => {
    console.log("Generating category options from:", categories);
    
    const options = [{ value: "", label: "ALL" }];
    
    if (categories && Array.isArray(categories)) {
      categories.forEach((cat) => {
        if (cat && cat.category_name) {
          options.push({
            value: cat.category_name,
            label: cat.category_name,
          });
        }
      });
    }
    
    return options;
  }, [categories]);

  // Auto-show HSN column when any row has HSN filled
  useEffect(() => {
    const hasAnyHsn = formData.rows.some((row) => {
      const hsn = String(row.hsn_code || "").trim();
      return hsn !== "";
    });
    setFormData((prev) => ({
      ...prev,
      visibleColumns: {
        ...prev.visibleColumns,
        hsn_code: hasAnyHsn,
      },
    }));
  }, [formData.rows]);

  // Load edit/view data
  useEffect(() => {
    if (!estimateToEdit) return;
    console.log("Loading edit data for estimate:", estimateToEdit);

    let itemsArray = [];
    try {
      itemsArray = JSON.parse(estimateToEdit.products || "[]");
    } catch (e) {
      console.error("Failed to parse products JSON", e);
      itemsArray = [];
    }

    const rows =
      Array.isArray(itemsArray) && itemsArray.length > 0
        ? itemsArray.map((product) => ({
            id: generateUniqueId(),
            product_id: product.product_id || "",
            product_name: product.product_name || "",
            hsn_code: String(product.hsn_code || ""),
            category: String(product.category || ""),
            Description: String(product.Description || ""),
            qty: String(product.qty || ""),
            unit: String(product.unit || "NONE"),
            priceUnitType: String(product.priceUnitType || "Without Tax"),
            price: String(product.price || ""),
            discountPercent: String(product.discountPercent || ""),
            discountAmount: String(product.discountAmount || "0.00"),
            taxPercent: Number(product.taxPercent || 0),
            taxAmount: String(product.taxAmount || "0.00"),
            amount: String(product.amount || "0.00"),
          }))
        : [INITIAL_ROW];

    // Set party selection
    if (estimateToEdit.parties_id) {
      const partyFromList = parties.find(
        (p) =>
          p.id == estimateToEdit.parties_id || p.parties_id == estimateToEdit.parties_id
      );
      if (partyFromList) {
        setSelectedPartyOption({
          value: partyFromList.id || partyFromList.parties_id,
          label: partyFromList.name,
        });
      }
    }

    const totalAmountRaw = rows.reduce((a, r) => a + Number(r.amount || 0), 0);
    const round_off = Number(estimateToEdit.round_off || 0);
    const round_off_amount = String(estimateToEdit.round_off_amount || "0");
    const finalRound = round_off === 1 ? Number(round_off_amount) : 0;
    const total = (totalAmountRaw + finalRound).toFixed(2);

    // Auto vs Manual round-off detection
    let manual = false;
    if (round_off === 1) {
      const autoRound = calculateAutoRoundOff(totalAmountRaw);
      manual = Math.abs(Number(round_off_amount) - Number(autoRound)) > 0.01;
    }
    setIsManualRoundOff(manual);

    // Reset image state properly
    setImagePreview(estimateToEdit.add_image || "");
    setImageFileName("");
    setHasUserUploadedImage(false);

    // Parse documents
    let docs = [];
    if (estimateToEdit.documents) {
      try {
        docs = JSON.parse(estimateToEdit.documents);
      } catch (e) {
        console.error("Failed to parse documents", e);
      }
    }
    setAttachedDocs(docs.map((d) => ({ name: d.name, data: d.data })));

    // Reset auto-fill checkbox in edit/view mode
    setAutoFillReceived(false);

    // Determine visible columns from data
    const hasCategory = rows.some(row => row.category && String(row.category).trim() !== "");
    const hasDescription = rows.some(row => row.Description && String(row.Description).trim() !== "");
    const hasHsn = rows.some(row => row.hsn_code && String(row.hsn_code).trim() !== "");
    const hasDiscount = rows.some(row => row.discountPercent && parseFloat(row.discountPercent) > 0);

    setFormData({
      parties_id: estimateToEdit.parties_id || "",
      name: estimateToEdit.name || "",
      phone: estimateToEdit.phone || "",
      billing_address: estimateToEdit.billing_address || "",
      shipping_address: estimateToEdit.shipping_address || "",
      estimate_no: estimateToEdit.estimate_no || "", // Changed from invoice_no
      estimate_date: // Changed from invoice_date
        estimateToEdit.estimate_date || new Date().toISOString().split("T")[0],
      state_of_supply: estimateToEdit.state_of_supply || "",
      payment_type: estimateToEdit.payment_type || "",
      description: estimateToEdit.description || "",
      add_image: estimateToEdit.add_image || "",
      rows,
      round_off,
      round_off_amount,
      total,
      received_amount: estimateToEdit.received_amount || " ",
      visibleColumns: {
        category: hasCategory,
        description: hasDescription,
        hsn_code: hasHsn,
        discount: hasDiscount,
      },
    });
    
    // Save to tabForms for the first tab
    setTabForms(prev => ({
      ...prev,
      1: {
        parties_id: estimateToEdit.parties_id || "",
        name: estimateToEdit.name || "",
        phone: estimateToEdit.phone || "",
        billing_address: estimateToEdit.billing_address || "",
        shipping_address: estimateToEdit.shipping_address || "",
       estimate_no: estimateToEdit.estimate_no || "", 
        estimate_date: estimateToEdit.estimate_date || new Date().toISOString().split("T")[0],
        state_of_supply: estimateToEdit.state_of_supply || "",
        payment_type: estimateToEdit.payment_type || "",
        description: estimateToEdit.description || "",
        add_image: estimateToEdit.add_image || "",
        rows,
        round_off,
        round_off_amount,
        total,
        received_amount: estimateToEdit.received_amount || " ",
        visibleColumns: {
          category: hasCategory,
          description: hasDescription,
          hsn_code: hasHsn,
          discount: hasDiscount,
        },
        _selectedPartyOption: selectedPartyOption,
        _imagePreview: estimateToEdit.add_image || "",
        _attachedDocs: docs.map((d) => ({ name: d.name, data: d.data })),
        _autoFillReceived: false,
        _credit: true,
        _isManualRoundOff: manual,
      }
    }));
  }, [estimateToEdit, parties]);

  // Handle party selection
  const handlePartySelect = (selectedOption) => {
    if (!selectedOption) {
      setSelectedPartyOption(null);
      setFormData((prev) => ({
        ...prev,
        parties_id: "",
        name: "",
        phone: "",
        billing_address: "",
        shipping_address: "",
        state_of_supply: "",
      }));
      return;
    }

    if (selectedOption.value === "add_party") {
      // Reset form and open modal
      setPartyForm({
        name: "",
        phone: "",
        gstin: "",
        email: "",
        state_of_supply: "",
        billing_address: "",
        shipping_address: "",
        amount: 0,
        transaction_type: "to receive",
        additional_field: "[]",
        creditlimit: 0,
        gstin_type_id: "",
        gstin_type_name: "",
      });
      handleOpenPartyModal();
      return;
    }

    const selectedParty = parties.find(
      (p) => p.id === selectedOption.value || p.parties_id === selectedOption.value
    );
    if (selectedParty) {
      setSelectedPartyOption(selectedOption);

      setFormData((prev) => ({
        ...prev,
        parties_id: selectedParty.parties_id || selectedParty.id || "",
        name: selectedParty.name || "",
        phone: selectedParty.phone || "",
        billing_address: selectedParty.billing_address || "",
        shipping_address: selectedParty.shipping_address || "",
        state_of_supply: selectedParty.state_of_supply || "",
      }));
    }
  };

  // ====================== PARTY CREATION FUNCTION ======================
  const handleAddParty = async () => {
    try {
      console.log("📝 Saving new party:", partyForm);
      
      // Validate required fields
      if (!partyForm.name?.trim()) {
        NotifyData("Party name is required", "error");
        return;
      }

      // Prepare payload EXACTLY matching your PHP backend
      const payload = {
        name: partyForm.name,
        phone: partyForm.phone || "",
        email: partyForm.email || "",
        billing_address: partyForm.billing_address || "",
        shipping_address: partyForm.shipping_address || "",
        amount: partyForm.amount || 0,
        creditlimit: partyForm.creditlimit || 0,
        state_of_supply: partyForm.state_of_supply || "",
        gstin: partyForm.gstin || "",
        gstin_type_id: partyForm.gstin_type_id || "",
        gstin_type_name: partyForm.gstin_type_name || "",
        additional_field: partyForm.additional_field || "[]",
        transactionType: partyForm.transaction_type === "to pay" ? "pay" : "receive"
      };

      console.log("🚀 Sending payload to API:", payload);

      // Make the API call
      const response = await axiosInstance.post("/parties.php", payload);
      console.log("✅ API Response:", response.data);
      
      // Check response
      if (response.data?.head?.code === 200) {
        // Close modal
        handleClosePartyModal();
        
        // Reset party form
        setPartyForm({
          name: "",
          phone: "",
          gstin: "",
          email: "",
          state_of_supply: "",
          billing_address: "",
          shipping_address: "",
          amount: 0,
          transaction_type: "to receive",
          additional_field: "[]",
          creditlimit: 0,
          gstin_type_id: "",
          gstin_type_name: "",
        });
        
        // Refresh parties list
        dispatch(fetchParties());
        
        // Create a temporary option for immediate selection
        const tempPartyId = `temp_${Date.now()}`;
        const tempOption = {
          value: tempPartyId,
          label: payload.name
        };
        
        // Update customers dropdown with temporary option
        const updatedCustomers = [
          { value: "", label: "Select Party" },
          { value: "add_party", label: "+ Add Party" },
          ...parties.map(p => ({ 
            value: p.id || p.parties_id, 
            label: p.name 
          })),
          tempOption
        ];
        setCustomers(updatedCustomers);
        
        // Select the new party
        setSelectedPartyOption(tempOption);
        
        // Update form data
        setFormData(prev => ({
          ...prev,
          parties_id: tempPartyId,
          name: payload.name,
          phone: payload.phone || "",
          billing_address: payload.billing_address || "",
          shipping_address: payload.shipping_address || "",
          state_of_supply: payload.state_of_supply || "",
        }));
        
      } else {
        // Show the actual error from PHP
        const errorMsg = response.data?.head?.msg || "Failed to create party";
        throw new Error(errorMsg);
      }
      
    } catch (error) {
      console.error("💥 Party creation error:", error);
      console.error("Error response data:", error.response?.data);
      
      // Show user-friendly error
      let errorMessage = error.message;
      if (error.response?.data?.head?.msg) {
        errorMessage = error.response.data.head.msg;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      NotifyData(errorMessage || "Failed to create party", "error");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (optional - max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setImageFileName(file.name);
      setHasUserUploadedImage(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData((prev) => ({
          ...prev,
          add_image: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert(`File ${file.name} is too large (max 10MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedDocs((prev) => [
          ...prev,
          {
            name: file.name,
            data: reader.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDocument = (index) => {
    setAttachedDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReceivedAmountChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      received_amount: value || " ",
    }));
  };

  // Handle auto-fill checkbox
  const handleAutoFillReceived = (e) => {
    const isChecked = e.target.checked;
    setAutoFillReceived(isChecked);

    if (isChecked) {
      setFormData((prev) => ({
        ...prev,
        received_amount: prev.total || "0",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        received_amount: " ",
      }));
    }
  };

  // Update received amount when total changes and auto-fill is checked
  useEffect(() => {
    if (autoFillReceived) {
      setFormData((prev) => ({
        ...prev,
        received_amount: prev.total || "0",
      }));
    }
  }, [formData.total, autoFillReceived]);

  // Computed totals
  const totalQty = formData.rows.reduce(
    (a, r) => a + (Number(r.qty) || 0),
    0
  );
  const totalDiscount = formData.rows.reduce(
    (a, r) => a + (Number(r.discountAmount) || 0),
    0
  );
  const totalTax = formData.rows.reduce(
    (a, r) => a + (Number(r.taxAmount) || 0),
    0
  );
  const totalAmountRaw = formData.rows.reduce(
    (a, r) => a + (Number(r.amount) || 0),
    0
  );
  const calculateAutoRoundOff = (amount) =>
    (Math.round(amount) - amount).toFixed(2);

  const toggleCredit = () => setCredit(!credit);
  const deleteRow = (id) => {
    const newRows = formData.rows.filter((r) => r.id !== id);
    const newTotalAmountRaw = newRows.reduce(
      (a, r) => a + Number(r.amount || 0),
      0
    );
    let finalRound =
      formData.round_off === 1 ? Number(formData.round_off_amount) : 0;
    if (formData.round_off === 1 && !isManualRoundOff) {
      const autoRound = calculateAutoRoundOff(newTotalAmountRaw);
      finalRound = Number(autoRound);
      setFormData((prev) => ({ ...prev, round_off_amount: autoRound }));
    }
    const newTotal = (newTotalAmountRaw + finalRound).toFixed(2);
    setFormData((prev) => ({ ...prev, rows: newRows, total: newTotal }));
  };

  const addRow = () => {
    const newRows = [
      ...formData.rows,
      { ...INITIAL_ROW, id: generateUniqueId() },
    ];
    const newTotalAmountRaw = newRows.reduce(
      (a, r) => a + Number(r.amount || 0),
      0
    );
    let finalRound =
      formData.round_off === 1 ? Number(formData.round_off_amount) : 0;
    if (formData.round_off === 1 && !isManualRoundOff) {
      const autoRound = calculateAutoRoundOff(newTotalAmountRaw);
      finalRound = Number(autoRound);
      setFormData((prev) => ({ ...prev, round_off_amount: autoRound }));
    }
    const newTotal = (newTotalAmountRaw + finalRound).toFixed(2);
    setFormData((prev) => ({ ...prev, rows: newRows, total: newTotal }));
  };

  const onRowChange = (id, field, value) => {
    setFormData((prev) => {
      const newRows = prev.rows.map((row) => {
        if (row.id !== id) return row;

        // Handle Select component (value is object) vs input (value is in target)
        let actualValue = value;
        if (value && value.target) actualValue = value.target.value;
        if (value && value.value !== undefined) actualValue = value.value;

        const updatedRow = { ...row, [field]: actualValue };

        // Recalculate amounts
        const qty = Number(updatedRow.qty) || 0;
        const price = Number(updatedRow.price) || 0;
        const discountPercent = Number(updatedRow.discountPercent) || 0;
        const taxPercent = Number(updatedRow.taxPercent) || 0;
        const priceUnitType = updatedRow.priceUnitType || "Without Tax";

        let basicTotal = qty * price;
        const discountAmount = (basicTotal * discountPercent) / 100;
        let taxableAmount = basicTotal - discountAmount;
        let taxAmount = 0;
        let finalAmount = taxableAmount;

        if (priceUnitType === "Without Tax") {
          taxAmount = (taxableAmount * taxPercent) / 100;
          finalAmount = taxableAmount + taxAmount;
        } else {
          taxAmount = (taxableAmount * taxPercent) / (100 + taxPercent);
          finalAmount = taxableAmount;
        }

        return {
          ...updatedRow,
          discountAmount: discountAmount.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          amount: finalAmount.toFixed(2),
        };
      });

      // Recalculate total
      const totalAmountRaw = newRows.reduce(
        (sum, r) => sum + Number(r.amount || 0),
        0
      );
      let finalTotal = totalAmountRaw;
      let roundOffAmt = prev.round_off_amount;

      if (prev.round_off === 1) {
        if (!isManualRoundOff) {
          roundOffAmt = (Math.round(totalAmountRaw) - totalAmountRaw).toFixed(2);
        }
        finalTotal = (totalAmountRaw + Number(roundOffAmt)).toFixed(2);
      } else {
        finalTotal = totalAmountRaw.toFixed(2);
      }

      return {
        ...prev,
        rows: newRows,
        total: finalTotal,
        round_off_amount: prev.round_off === 1 ? roundOffAmt : "0",
      };
    });
  };

  const handleRoundOffChange = (e) => {
    const val = e.target.value || "0";
    setIsManualRoundOff(true);
    const newTotalAmountRaw = formData.rows.reduce(
      (a, r) => a + Number(r.amount || 0),
      0
    );
    const finalRound = formData.round_off === 1 ? Number(val) : 0;
    const newTotal = (newTotalAmountRaw + finalRound).toFixed(2);
    setFormData((prev) => ({
      ...prev,
      round_off_amount: val,
      total: newTotal,
    }));
  };

  const handleRoundOffToggle = (e) => {
    const checked = e.target.checked ? 1 : 0;
    const newTotalAmountRaw = formData.rows.reduce(
      (a, r) => a + Number(r.amount || 0),
      0
    );
    let roundOffAmt = "0";
    let finalRound = 0;
    if (checked === 1) {
      setIsManualRoundOff(false);
      roundOffAmt = calculateAutoRoundOff(newTotalAmountRaw);
      finalRound = Number(roundOffAmt);
    } else {
      setIsManualRoundOff(false);
    }

    const newTotal = (newTotalAmountRaw + finalRound).toFixed(2);
    setFormData((prev) => ({
      ...prev,
      round_off: checked,
      round_off_amount: roundOffAmt,
      total: newTotal,
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    console.log("Saving estimate...");
    try {
      // 1. Prepare documents JSON
      const documentsJson = JSON.stringify(
        attachedDocs.map((doc) => ({
          name: doc.name,
          data: doc.data,
        }))
      );
      console.log("documentsJson", documentsJson);

      // 2. Final payload
      const payload = {
        ...formData,
        products: JSON.stringify(formData.rows),
        add_image: formData.add_image || "",
        documents: documentsJson,
        estimate_no: formData.estimate_no,
        total: formData.total,
        round_off: formData.round_off ? 1 : 0,
        round_off_amount: formData.round_off_amount,
        received_amount: formData.received_amount || 0,
      };

      // Remove rows from payload
      delete payload.rows;
      delete payload.visibleColumns; // Don't send visibleColumns to backend

      // VERY IMPORTANT: Only add edit_sales_id in EDIT mode
      if (isEditMode) {
        payload.edit_estimates_id = id;
      }

      console.log("Sending payload:", payload);

      if (isEditMode) {
        await dispatch(updateEstimate(payload)).unwrap();
        NotifyData("Estimate Updated Successfully!", "success");
      } else {
        await dispatch(createEstimate(payload)).unwrap();
        NotifyData("Estimate Created Successfully!", "success");
      }

      dispatch(searchEstimates(""));
      navigate("/estimate");
    } catch (err) {
      console.error("Save error:", err);
      NotifyData(err?.message || "Failed to save estimate", "error");
    }
  };
  

  const handleBack = () => navigate("/estimate");
  const title = isViewMode
    ? "View Estimate"
    : isEditMode
    ? "Edit Estimate"
    : "Create Estimate";
  const priceUnitTypeOptions = PRICE_UNIT_TYPES.map((pt) => ({
    value: pt,
    label: pt,
  }));

  // Show loading state if data is still loading
  if (productStatus === "loading" || categoryStatus === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          
        </div>
      </div>
    );
  }

  return (
    <div id="main">
      {/* ============== TAB NAVIGATION START ============== */}
      <div className="bg-white border-bottom shadow-sm">
        <div className="d-flex align-items-center">
          {tabs.map((tab, index) => (
            <div key={tab.id} className="d-flex align-items-center">
              <div
                onClick={() => switchTab(tab.id)}
                className={`px-4 py-5 d-flex align-items-center gap-2 cursor-pointer position-relative ${
                  tab.active ? "bg-light border-top border-primary border-3" : "text-muted"
                }`}
                style={{ 
                  marginTop: tab.active ? "-2px" : "0",
                  minWidth: "80px",
                  
                  borderRight: "1px solid #dee2e6"
                }}
              >
                <span className="fw-bold">{tab.title}</span>
                {tabs.length > 1 && (
                  <FaTimes
                    className="text-danger ms-5"
                    style={{ fontSize: "14px", cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                  />
                )}
              </div>

              {/* + Icon next to last tab */}
              {index === tabs.length - 1 && !isViewMode && !isEditMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addNewTab();
                  }}
                  className="btn btn-link text-primary ms-2"
                  style={{ fontSize: "20px" }}
                  title="Add New Tab"
                >
                  <FaPlus />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* ============== TAB NAVIGATION END ============== */}

      <Container fluid className="py-5">
        <Row className="py-3">
          <Col>
            <Row className="mb-3">
              <Col md={9}>
                <Row className="mb-3">
                 
                  {!isViewMode && (
                    <div className="d-flex align-items-center gap-4 mb-3">
                      <span className={`fw-medium ${credit ? "text-primary" : "text-muted"}`}>
                        Credit
                      </span>

                      <label className="position-relative d-inline-block" style={{ cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={credit}
                          onChange={toggleCredit}
                          style={{
                            opacity: 0,
                            width: 0,
                            height: 0,
                            position: "absolute",
                          }}
                        />
                        <span
                          style={{
                            display: "block",
                            width: "44px",
                            height: "24px",
                            backgroundColor: credit ? "#0d6efd" : "#ced4da",
                            borderRadius: "12px",
                            position: "relative",
                            transition: "background-color 0.25s ease",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              top: "3px",
                              left: credit ? "22px" : "3px",
                              width: "18px",
                              height: "18px",
                              backgroundColor: "white",
                              borderRadius: "50%",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                              transition: "left 0.25s ease",
                            }}
                          />
                        </span>
                      </label>

                      <span className={`fw-medium ${!credit ? "text-success" : "text-muted"}`}>
                        Cash
                      </span>
                    </div>
                  )}
                  <Col md={3}>
                    <label>Customer Name</label>
                    <div className="d-flex gap-2">
                      {isViewMode ? (
                        <div
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #ced4da",
                            borderRadius: "6px",
                            backgroundColor: "#e9ecef",
                            minHeight: "38px",
                            display: "flex",
                            alignItems: "center",
                            width: "100%"
                          }}
                        >
                          <span style={{ color: "#000" }}>
                            {formData.name || "No party selected"}
                          </span>
                        </div>
                      ) : (
                        // <Select
                        //   value={selectedPartyOption}
                        //   onChange={handlePartySelect}
                        //   options={customers}
                        //   placeholder="Select Party"
                        //   isSearchable
                        //   menuPortalTarget={document.body}
                        //   styles={{
                        //     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        //     control: (base) => ({ ...base, minHeight: 38 }),
                        //   }}
                        //   menuPosition="fixed"
                        // />
                        <Select
                                                  value={selectedPartyOption}
                                                  onChange={handlePartySelect}
                                                  options={customers}
                                                  placeholder="Select Party"
                                                  isSearchable
                                                  menuPortalTarget={document.body}
                                                  styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                    control: (base) => ({ ...base, minHeight: 38 }),
                                                  }}
                                                  menuPosition="fixed"
                                                />
                      )}
                    </div>
                  </Col>
                  <Col md={3}>
                    <TextInputform
                      formLabel="Phone Number"
                      formtype="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      readOnly={isDisabled}
                    />
                  </Col>
                </Row>
                {/* Show billing/shipping address ALWAYS in view mode, conditionally in edit/create */}
{(isViewMode || credit) && (
  <Row className="mb-3">
    <Col md={3}>
      {isViewMode ? (
        <div>
          <label className="form-label">Billing Address</label>
          <div
            style={{
              padding: "8px 12px",
              border: "1px solid #ced4da",
              borderRadius: "6px",
              backgroundColor: "#e9ecef",
              minHeight: "80px",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <span style={{ color: "#000" }}>
              {formData.billing_address || "N/A"}
            </span>
          </div>
        </div>
      ) : (
        <TextArea
          textlabel="Billing Address"
          value={formData.billing_address}
          onChange={(e) =>
            handleInputChange("billing_address", e.target.value)
          }
          readOnly={isDisabled}
        />
      )}
    </Col>
    <Col md={3}>
      {isViewMode ? (
        <div>
          <label className="form-label">Shipping Address</label>
          <div
            style={{
              padding: "8px 12px",
              border: "1px solid #ced4da",
              borderRadius: "6px",
              backgroundColor: "#e9ecef",
              minHeight: "80px",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <span style={{ color: "#000" }}>
              {formData.shipping_address || "N/A"}
            </span>
          </div>
        </div>
      ) : (
        <TextArea
          textlabel="Shipping Address"
          value={formData.shipping_address}
          onChange={(e) =>
            handleInputChange("shipping_address", e.target.value)
          }
          readOnly={isDisabled}
        />
      )}
    </Col>
  </Row>
)}
              </Col>
              <Col md={2} style={{ zIndex: 100 }}>
                <TextInputform
                  formLabel="Estimate No"
                  value={formData.estimate_no || "Generating..."}
                  readOnly={true}
                  style={{
                    backgroundColor: "#f0fff0",
                    fontWeight: "bold",
                    color: "#006400",
                    fontSize: "1.1em",
                  }}
                />
                <Calender
                  calenderlabel="Estimate Date"
                  initialDate={formData.estimate_date}
                  readOnly={isDisabled}
                />
                <DropDown
                  textlabel="State of supply"
                  value={formData.state_of_supply}
                  onChange={(e) =>
                    handleInputChange("state_of_supply", e.target.value)
                  }
                  options={STATE_OF_SUPPLY_OPTIONS}
                  disabled={isDisabled}
                />
              </Col>
            </Row>
            
           <Row className="item-table-row mt-4">
  <Col>
    {/* Scrollable container for the table */}
    <div 
      className="table-scroll-container"
      style={{ 
        maxHeight: "400px", // Adjust this value as needed
        overflow: "auto",
        border: "1px solid #dee2e6",
        borderRadius: "6px",
        position: "relative"
      }}
    >
      <Table
        bordered
        hover
        className="mb-0 sale-items-table"
        style={{ 
          minWidth: "1600px", 
          tableLayout: "fixed",
          marginBottom: "0"
        }}
      >
        <thead
          className="table-light table-header-sticky"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "#f8f9fa",
          }}
        >
          <tr>
            <th style={{ width: "50px" }}>#</th>
            {formData.visibleColumns.category && <th style={{ width: "180px" }}>Category</th>}
            <th style={{ width: "300px" }}>Item</th>
            {formData.visibleColumns.description && (
              <th style={{ width: "180px" }}>Description</th>
            )}
            {formData.visibleColumns.hsn_code && <th style={{ width: "100px" }}>HSN_code</th>}
            <th style={{ width: "100px" }}>Qty</th>
            <th style={{ width: "150px" }}>Unit</th>
            <th style={{ width: "100px" }}>Price</th>
            <th style={{ width: "100px" }}>Price/unit</th>
            {formData.visibleColumns.discount && <th style={{ width: "150px" }}>Discount</th>}
            <th style={{ width: "120px" }}>Tax</th>
            <th style={{ width: "120px" }} className="th-amount-column">
              {!isViewMode ? (
                <DropdownButton
                  id="amount-column-dropdown"
                  title={
                    <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                      Amount <FaPlus />
                    </span>
                  }
                  size="sm"
                  align="end"
                  className="p-0 border-0 text-success shadow-none amount-dropdown-trigger"
                  style={{ 
                    background: "transparent", 
                    boxShadow: "none",
                  }}
                >
                  <div className="fixed-dropdown">
                    {[
                      { key: "category", label: "Category" },
                      { key: "hsn_code", label: "HSN-Code" },
                      { key: "description", label: "Description" },
                      { key: "discount", label: "Discount" },
                    ].map((col) => (
                      <Dropdown.Item
                        key={col.key}
                        as="div"
                        className="dropdown-item-checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Form.Check
                          type="checkbox"
                          label={col.label}
                          checked={formData.visibleColumns[col.key] || false}
                          onChange={(e) => {
                            e.stopPropagation();
                            setFormData((prev) => ({
                              ...prev,
                              visibleColumns: {
                                ...prev.visibleColumns,
                                [col.key]: e.target.checked,
                              },
                            }));
                          }}
                          disabled={isDisabled}
                        />
                      </Dropdown.Item>
                    ))}
                    <Dropdown.Divider className="dropdown-divider-custom" />
                    <Dropdown.Item
                      className="more-settings-item"
                      onClick={() => setShowSettingsModal(true)}
                    >
                      <BsGearWideConnected style={{ fontSize: "1.25rem" }} />
                      More Settings
                    </Dropdown.Item>
                  </div>
                </DropdownButton>
              ) : (
                <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  Amount
                </span>
              )}
            </th>
            <th style={{ width: "80px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {formData.rows.map((row, index) => (
            <tr key={row.id}>
              <td>{index + 1}</td>

              {formData.visibleColumns.category && (
                <td>
                  {isViewMode ? (
                    <div
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #ced4da",
                        borderRadius: "6px",
                        backgroundColor: "#e9ecef",
                        minHeight: "38px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#000" }}>
                        {row.category || "ALL"}
                      </span>
                    </div>
                  ) : (
                    <Select
                      options={categoryOptions}
                      value={
                        categoryOptions.find(opt => opt.value === row.category) || 
                        categoryOptions[0]
                      }
                      onChange={(option) => {
                        const selectedCat = option.value;
                        onRowChange(row.id, "category", selectedCat);
                      }}
                      placeholder="Select Category"
                      isDisabled={isDisabled}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                    />
                  )}
                </td>
              )}

              <td style={{ position: "relative" }}>
                {isViewMode ? (
                  <div
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ced4da",
                      borderRadius: "6px",
                      backgroundColor: "#e9ecef",
                      minHeight: "38px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#000" }}>
                      {row.product_name || "No item selected"}
                    </span>
                  </div>
                ) : (
                  <div
                    onClick={() => !isDisabled && setShowProductTable(true)}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ced4da",
                      borderRadius: "6px",
                      backgroundColor: isDisabled ? "#e9ecef" : "white",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      minHeight: "38px",
                    }}
                  >
                    <span style={{ color: row.product_name ? "#000" : "#999" }}>
                      {row.product_name || "Click to select item..."}
                    </span>
                  </div>
                )}

                {showProductTable && !isViewMode && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 9999,
                    }}
                    onClick={() => setShowProductTable(false)}
                  >
                    <div
                      style={{
                        width: "90%",
                        maxWidth: "1100px",
                        height: "85vh",
                        background: "white",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2 bg-primary text-white d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-3">
                          <Button
                            variant="light"
                            size="sm"
                            className="fw-bold px-4 d-flex align-items-center gap-2"
                            onClick={() => {
                              setShowAddItemModal(true);
                              setShowProductTable(false);
                            }}
                          >
                            Add Item
                          </Button>
                        </div>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => setShowProductTable(false)}
                        >
                          X Close
                        </Button>
                      </div>

                      <div
                        style={{
                          height: "calc(85vh - 140px)",
                          overflowY: "auto",
                        }}
                      >
                        <Table bordered hover className="mb-0">
                          <thead className="table-light sticky-top">
                            <tr>
                              <th>Product Name</th>
                              <th className="text-end">Sale Price</th>
                              <th className="text-end">Purchase Price</th>
                              <th className="text-end">Stock</th>
                              <th>Location</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products
                              .filter((product) => {
                                if (
                                  !row.category ||
                                  row.category === "" ||
                                  row.category === "ALL"
                                )
                                  return true;

                                const productCat =
                                  product.category_name || product.category || "";
                                return productCat === row.category;
                              })
                              .map((product) => {
                                let salePrice = "0";
                                let purchasePrice = "0";
                                let stock = "0";
                                let location = "-";

                                try {
                                  const sp = JSON.parse(
                                    product.sale_price || "{}"
                                  );
                                  salePrice = sp.price || "0";
                                  
                                  const pp = JSON.parse(
                                    product.purchase_price || "{}"
                                  );
                                  purchasePrice = pp.price || "0";
                                } catch (e) { 
                                  console.error("Error parsing prices:", e);
                                }
                                try {
                                  const st = JSON.parse(
                                    product.stock || "{}"
                                  );
                                  stock = st.opening_qty || "0";
                                  location = st.location || "-";
                                } catch (e) { 
                                  console.error("Error parsing stock:", e);
                                }

                                return (
                                  <tr
                                    key={product.product_id || product.id}
                                    style={{ cursor: "pointer" }}
                                    className="hover-row"
                                    onClick={() => {
                                      onRowChange(
                                        row.id,
                                        "product_name",
                                        product.product_name || product.name
                                      );
                                      onRowChange(
                                        row.id,
                                        "product_id",
                                        product.product_id || product.id
                                      );
                                      onRowChange(
                                        row.id,
                                        "hsn_code",
                                        product.hsn_code || ""
                                      );
                                      onRowChange(
                                        row.id,
                                        "price",
                                        salePrice
                                      );
                                      onRowChange(row.id, "qty", "1");

                                      const cat =
                                        product.category_name || product.category || "";
                                      onRowChange(
                                        row.id,
                                        "category",
                                        cat
                                      );
                                      const unitValue =
                                        product.unit_value || "NONE";
                                      onRowChange(
                                        row.id,
                                        "unit",
                                        unitValue
                                      );

                                      setShowProductTable(false);
                                    }}
                                  >
                                    <td>
                                      <strong>{product.product_name || product.name}</strong>
                                    </td>
                                    <td className="text-end text-success fw-bold">
                                      ₹{salePrice}
                                    </td>
                                    <td className="text-end text-info fw-bold">
                                      ₹{purchasePrice}
                                    </td>
                                    <td className="text-center">
                                      {stock}
                                    </td>
                                    <td className="text-center">
                                      {location}
                                    </td>
                                  </tr>
                                );
                              })}

                            {products.filter((p) => {
                              if (
                                !row.category ||
                                row.category === "" ||
                                row.category === "ALL"
                              )
                                return true;
                              const cat = p.category_name || p.category || "";
                              return cat === row.category;
                            }).length === 0 && (
                                <tr>
                                  <td
                                    colSpan="5"
                                    className="text-center py-5 text-muted"
                                  >
                                    <h5>
                                      No products found in "
                                      {row.category}" category
                                    </h5>
                                    <small>
                                      {categories.length > 0 
                                        ? `Available categories: ${categories.map(c => c.category_name).join(", ")}`
                                        : "No categories available"}
                                    </small>
                                  </td>
                                </tr>
                              )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}
              </td>
              

              {formData.visibleColumns.description && (
                <td>
                  {isViewMode ? (
                    <div
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #ced4da",
                        borderRadius: "6px",
                        backgroundColor: "#e9ecef",
                        minHeight: "38px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#000" }}>
                        {row.Description || "N/A"}
                      </span>
                    </div>
                  ) : (
                    <TextArea
                      value={row.Description || ""}
                      onChange={(e) =>
                        onRowChange(row.id, "Description", e.target.value)
                      }
                      readOnly={isDisabled}
                      placeholder="Enter item description"
                      rows={2}
                    />
                  )}
                </td>
              )}
              
              {formData.visibleColumns.hsn_code && (
                <td>
                  {isViewMode ? (
                    <div
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #ced4da",
                        borderRadius: "6px",
                        backgroundColor: "#e9ecef",
                        minHeight: "38px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#000" }}>
                        {String(row.hsn_code || "").trim() || "N/A"}
                      </span>
                    </div>
                  ) : (
                    <TextArea
                      type="text"
                      value={String(row.hsn_code || "").trim()}
                      onChange={(e) =>
                        onRowChange(row.id, "hsn_code", e.target.value)
                      }
                      readOnly={isDisabled}
                    />
                  )}
                </td>
              )}

              <td>
                <TextInputform
                  expanse="number"
                  value={row.qty}
                  onChange={(e) =>
                    onRowChange(row.id, "qty", e.target.value)
                  }
                  readOnly={isDisabled}
                />
              </td>
              <td>
                {isViewMode ? (
                  <div
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ced4da",
                      borderRadius: "6px",
                      backgroundColor: "#e9ecef",
                      minHeight: "38px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#000" }}>
                      {row.unit || "NONE"}
                    </span>
                  </div>
                ) : (
                  <Select
                    value={
                      unitOptions.find(
                        (opt) => opt.value === row.unit
                      ) || unitOptions[0]
                    }
                    options={unitOptions}
                    onChange={(selectedOption) =>
                      onRowChange(row.id, "unit", selectedOption.value)
                    }
                    isDisabled={isDisabled}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                )}
              </td>
              <td>
                <TextInputform
                  expanse="number"
                  value={row.price}
                  onChange={(e) =>
                    onRowChange(row.id, "price", e.target.value)
                  }
                  readOnly={isDisabled}
                />
              </td>
              <td>
                {isViewMode ? (
                  <div
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ced4da",
                      borderRadius: "6px",
                      backgroundColor: "#e9ecef",
                      minHeight: "38px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#000" }}>
                      {row.priceUnitType || "Without Tax"}
                    </span>
                  </div>
                ) : (
                  <DropDown
                    value={row.priceUnitType}
                    onChange={(v) =>
                      onRowChange(row.id, "priceUnitType", v)
                    }
                    options={priceUnitTypeOptions}
                    disabled={isDisabled}
                  />
                )}
              </td>

              {formData.visibleColumns.discount && (
                <td>
                  <InputGroup size="sm">
                    <FormControl
                      expanse="number"
                      placeholder="%"
                      value={row.discountPercent}
                      onChange={(e) =>
                        onRowChange(
                          row.id,
                          "discountPercent",
                          e.target.value
                        )
                      }
                      readOnly={isDisabled}
                    />
                    <FormControl
                      value={row.discountAmount}
                      readOnly
                    />
                  </InputGroup>
                </td>
              )}

              <td>
                {isViewMode ? (
                  <div>
                    <div
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #ced4da",
                        borderRadius: "6px",
                        backgroundColor: "#e9ecef",
                        minHeight: "38px",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <span style={{ color: "#000" }}>
                        {row.taxPercent}%
                      </span>
                    </div>
                    <TextInputform
                      readOnly
                      value={row.taxAmount || "0.00"}
                      style={{ marginTop: "5px" }}
                      className="text-center"
                    />
                  </div>
                ) : (
                  <>
                    <Select
                      value={
                        TAX_OPTIONS.find(
                          (opt) => String(opt.value) === String(row.taxPercent)
                        ) || TAX_OPTIONS[0]
                      }
                      onChange={(v) =>
                        onRowChange(row.id, "taxPercent", v.value)
                      }
                      options={TAX_OPTIONS}
                      isDisabled={isDisabled}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                    />
                    <TextInputform
                      readOnly
                      value={row.taxAmount || "0.00"}
                      style={{ marginTop: "5px" }}
                      className="text-center"
                    />
                  </>
                )}
              </td>
              <td>
                <TextInputform readOnly value={row.amount} />
              </td>
              <td>
                {!isViewMode && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteRow(row.id)}
                  >
                    <FaTimes />
                  </Button>
                )}
              </td>
            </tr>
          ))}

          {!isViewMode && (
            <tr>
              <td colSpan={
                1 + // #
                (formData.visibleColumns.category ? 1 : 0) +
                1 + // Item
                (formData.visibleColumns.description ? 1 : 0) +
                (formData.visibleColumns.hsn_code ? 1 : 0) +
                1 + // Qty
                1 + // Unit
                1 + // Price
                1 + // Price/unit
                (formData.visibleColumns.discount ? 1 : 0) +
                1 + // Tax
                1 + // Amount
                1 // Actions
              }>
                <Button size="sm" onClick={addRow}>
                  <FaPlus /> ADD ROW
                </Button>
              </td>
            </tr>
          )}

          {/* FIXED TOTAL ROW */}
          <tr>
            {/* "TOTAL" label - spans columns up to Qty */}
            <td colSpan={
              1 + // #
              (formData.visibleColumns.category ? 1 : 0) +
              1 + // Item
              (formData.visibleColumns.description ? 1 : 0) +
              (formData.visibleColumns.hsn_code ? 1 : 0)
            }>
              <strong>TOTAL</strong>
            </td>

            {/* Qty total */}
            <td className="fw-bold text-center">{totalQty}</td>

            {/* Empty columns for Unit, Price, Price/unit */}
            <td></td> {/* Unit */}
            <td></td> {/* Price */}
            <td></td> {/* Price/unit */}

            {/* Empty Discount column if shown */}
            {formData.visibleColumns.discount && <td></td>}

            {/* Tax total */}
            <td className="fw-bold text-center">{totalTax.toFixed(2)}</td>

            {/* Amount total */}
            <td className="fw-bold text-end">{totalAmountRaw.toFixed(2)}</td>

            {/* Empty Actions column */}
            <td></td>
          </tr>
        </tbody>
      </Table>
    </div>
  </Col>
</Row>
            <Row className="additional-actions mt-3 align-items-center">
              <Col xs={3}>
                {isViewMode ? (
                  <div>
                    <label className="form-label">Payment Type</label>
                    <div
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #ced4da",
                        borderRadius: "6px",
                        backgroundColor: "#e9ecef",
                        minHeight: "38px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#000" }}>
                        {formData.payment_type || "Not selected"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <DropDown
                    textlabel="Payment Type"
                    value={formData.payment_type}
                    onChange={(e) =>
                      handleInputChange("payment_type", e.target.value)
                    }
                    options={PAYMENT_OPTIONS}
                    disabled={isDisabled}
                  />
                )}
              </Col>
              <Row className="additional-actions mt-3 align-items-center">
                <Col xs={3}>
                  <TextInputform
                    formLabel="Description"
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    readOnly={isDisabled}
                    placeholder="Enter description (optional)"
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={3}>
                  <label className="form-label">Add Image</label>

                  <label
                    htmlFor="sale-image-upload"
                    style={{
                      border: "2px solid #ced4da",
                      borderRadius: "12px",
                      padding: "20px",
                      textAlign: "center",
                      backgroundColor: "#f8fbff",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      opacity: isDisabled ? 0.5 : 1,
                      display: "block",
                    }}
                  >
                    {imagePreview ? (
                      <>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowImageModal(true);
                          }}
                          style={{
                            display: "inline-block",
                            cursor: isDisabled ? "default" : "zoom-in",
                          }}
                        >
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "200px",
                              borderRadius: "8px",
                              transition: "0.3s",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                              pointerEvents: "none",
                            }}
                            onMouseOver={(e) =>
                              !isDisabled && (e.currentTarget.style.transform = "scale(1.03)")
                            }
                            onMouseOut={(e) =>
                              !isDisabled && (e.currentTarget.style.transform = "scale(1)")
                            }
                          />
                        </div>

                        {imageFileName && (
                          <p className="text-success">
                            <strong>{imageFileName}</strong>
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <i className="fas fa-cloud-upload-alt fa-3x text-primary mb-3"></i>
                        <p>
                          <strong>{isViewMode ? "No Image Uploaded" : "Click to Upload Image"}</strong>
                        </p>
                      </>
                    )}
                  </label>

                  {!isViewMode && (
                    <>
                      <input
                        id="sale-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                        disabled={isDisabled}
                      />

                      {imagePreview && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setImagePreview("");
                            setImageFileName("");
                            setHasUserUploadedImage(true);
                            setFormData((prev) => ({
                              ...prev,
                              add_image: "",
                            }));
                            document.getElementById("sale-image-upload").value = "";
                          }}
                        >
                          X
                        </Button>
                      )}
                    </>
                  )}
                </Col>
                {formData.add_image && !imagePreview && (
                  <Col md={4}>
                    <label className="form-label">Current Image</label>
                    <img
                      src={formData.add_image}
                      alt="Attached"
                      style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
                    />
                  </Col>
                )}
              </Row>
              <Col xs={3} className="mt-4">
                <label className="form-label">
                  Attach Documents (PDF/Excel)
                </label>

                <label
                  htmlFor="doc-upload"
                  style={{
                    border: "2px solid #ced4da",
                    borderRadius: "12px",
                    padding: "20px",
                    textAlign: "center",
                    backgroundColor: isViewMode ? "#e9ecef" : "#f8fff9",
                    cursor: isViewMode ? "not-allowed" : "pointer",
                    display: "block",
                  }}
                >
                  <i className="fas fa-file-upload fa-3x text-success mb-3"></i>
                  <p>
                    <strong>{isViewMode ? "Document Upload (Disabled)" : "Click to upload PDF or Excel files"}</strong>
                    <br />
                    <small>Multiple files allowed</small>
                  </p>
                </label>

                {!isViewMode && (
                  <input
                    id="doc-upload"
                    type="file"
                    accept=".pdf, .xlsx, .xls"
                    multiple
                    onChange={handleDocumentUpload}
                    style={{ display: "none" }}
                    disabled={isDisabled}
                  />
                )}

                {attachedDocs.length > 0 && (
                  <div className="mt-3">
                    <h6>Attached Files:</h6>
                    {attachedDocs.map((doc, idx) => (
                      <div
                        key={idx}
                        className="d-flex align-items-center gap-2 mb-2 p-2 border rounded"
                      >
                        {doc.name.endsWith(".pdf") ? (
                          <i className="fas fa-file-pdf text-danger fa-2x"></i>
                        ) : (
                          <i className="fas fa-file-excel text-success fa-2x"></i>
                        )}
                        <div className="flex-grow-1">
                          <small
                            className="d-block text-truncate"
                            style={{ maxWidth: "300px" }}
                          >
                            {doc.name}
                          </small>
                          <a
                            href={doc.data}
                            download={doc.name}
                            className="text-primary small"
                          >
                            Download
                          </a>
                        </div>
                        {!isViewMode && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => removeDocument(idx)}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Col>
              <Col className="d-flex justify-content-end align-items-center gap-2">
                <CheckBox
                  OnChange={handleRoundOffToggle}
                  boxLabel="Round Off"
                  type="checkbox"
                  checked={formData.round_off === 1}
                  disabled={isDisabled}
                />
                <TextInputform
                  formtype="number"
                  value={formData.round_off_amount}
                  onChange={handleRoundOffChange}
                  readOnly={formData.round_off !== 1 || isDisabled}
                />
                <strong>Total</strong>
                <TextInputform readOnly value={formData.total} />

                <div className="d-flex align-items-center gap-3 mb-2">
                  {!isViewMode && (
                    <div className="d-flex align-items-center gap-1">
                      <input
                        type="checkbox"
                        id="auto-fill-received"
                        checked={autoFillReceived}
                        onChange={handleAutoFillReceived}
                        style={{
                          cursor: "pointer",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                      <label
                        htmlFor="auto-fill-received"
                        style={{
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          marginLeft: "5px",
                        }}
                      >
                       
                      </label>
                    </div>
                  )}
                  <strong style={{ width: "140px" }}>Received</strong>
                  <div className="d-flex align-items-center gap-2">
                    <TextInputform
                      expanse="number"
                      step="0.01"
                      value={formData.received_amount || ""}
                      onChange={(e) => {
                        handleInputChange("received_amount", e.target.value);
                        if (autoFillReceived) {
                          setAutoFillReceived(false);
                        }
                      }}
                      readOnly={isDisabled}
                      style={{ width: "160px" }}
                    />
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <strong style={{ width: "140px" }}>Balance</strong>
                  <TextInputform
                    readOnly
                    value={(
                      Number(formData.total || 0) -
                      Number(formData.received_amount || 0)
                    )}
                    style={{
                      width: "160px",
                      textAlign: "center",
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row className="py-3">
              <Col className="d-flex justify-content-between align-items-end">
                <Button variant="secondary" onClick={handleBack} size="lg">
                  Back
                </Button>
                {!isViewMode && (
                  <Button
                    variant="outline-primary"
                    onClick={handleSave}
                    size="lg"
                  >
                    {isEditMode ? "Update Estimate" : "Save Estimate"}
                  </Button>
                )}
              </Col>
            </Row>
          </Col>
        </Row>

        <Modal
          show={showImageModal}
          onHide={() => {}}
          size="xl"
          centered
          keyboard={false}
          dialogClassName="transparent-modal"
        >
          <Modal.Body
            className="p-0 d-flex align-items-center justify-content-center position-relative"
            style={{
              minHeight: "100vh",
              margin: 0,
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <img
              src={imagePreview}
              alt="Full size"
              style={{
                maxWidth: "95vw",
                maxHeight: "95vh",
                objectFit: "contain",
                borderRadius: "16px",
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />

            <Button
              variant="outline-light"
              size="lg"
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                zIndex: 1051,
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "red",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowImageModal(false);
              }}
            >
              <FaTimes size={26} />
            </Button>
          </Modal.Body>
        </Modal>
        
        <PartyModal
          show={showPartyModal}
          handleClose={handleClosePartyModal}
          isEdit={false}
          formData={partyForm}
          setFormData={setPartyForm}
          handleSubmit={handleAddParty}
          handleSaveAndNew={() => {}}
          handleDelete={() => {}}
        />
        
        <AddItem
          show={showAddItemModal}
          onHide={() => {
            setShowAddItemModal(false);
            setShowProductTable(true);
            dispatch(fetchProducts(""));
          }}
          activeTab="PRODUCT"
        />
        
        <Modal
          show={showSettingsModal}
          onHide={() => setShowSettingsModal(false)}
          size="xl"
          fullscreen="lg-down"
        >
          <Modal.Body className="p-0">
            <div className="d-flex">
              <div
                className="bg-dark text-white"
                style={{ width: "280px", minHeight: "100vh" }}
              >
                <div className="p-4">
                  <h4 className="mb-4 d-flex align-items-center gap-2">
                    <BsGearWideConnected /> Settings
                  </h4>
                  <nav>
                    {[
                      "GENERAL",
                      "TRANSACTION",
                      "PRINT",
                      "TAXES & GST",
                      "TRANSACTION MESSAGE",
                      "PARTY",
                      "ITEM",
                      "SERVICE REMINDERS",
                      "ACCOUNTING",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`py-3 px-4 cursor-pointer ${
                          item === "ITEM" ? "bg-primary text-white" : "text-white"
                        }`}
                        style={{
                          borderLeft:
                            item === "ITEM" ? "4px solid #0d6efd" : "none",
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="flex-grow-1 bg-white">
                <div
                  className="p-4"
                  style={{ background: "#fff", minHeight: "100vh" }}
                >
                  <div className="border-bottom px-4 py-3 mb-4 d-flex justify-content-between align-items-center">
                    {enableItem ? (
                      <div className="container-fluid px-0">
                        <div
                          className="row text-dark fw-bold"
                          style={{ fontSize: "16px" }}
                        >
                          <div className="col-md-4 d-flex align-items-center">
                            Item Settings
                          </div>
                          <div className="col-md-4 d-flex justify-content-center">
                            Additional Item Fields
                          </div>
                          <div className="col-md-4 d-flex justify-content-end">
                            Item Custom Fields
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="container-fluid px-0">
                        <div
                          className="row text-dark fw-bold"
                          style={{ fontSize: "16px" }}
                        >
                          <div className="col-md-4 d-flex align-items-center">
                            Item Settings
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      variant="light"
                      onClick={() => setShowSettingsModal(false)}
                    >
                      <BsX size={22} />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="enable_item"
                        checked={enableItem}
                        onChange={(e) => setEnableItem(e.target.checked)}
                        style={{ width: "20px", height: "20px" }}
                      />
                      <label
                        className="form-check-label ms-3"
                        htmlFor="enable_item"
                        style={{ fontSize: "16px", fontWeight: "500" }}
                      >
                        Enable Item
                      </label>
                    </div>
                  </div>

                  {enableItem ? (
                    <div className="row">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">What do you sell?</label>
                          <select className="form-select">
                            <option>Product</option>
                            <option>Service</option>
                            <option>Product/Service</option>
                          </select>
                        </div>

                        {[
                          "Barcode Scan",
                          "Stock Maintenance",
                          "Show Low Stock Dialog",
                          "Items Unit",
                          "Item Category",
                          "Party Wise Item Rate",
                          "Description",
                          "Item wise Tax",
                          "Item wise Discount",
                          "Update Sale Price from Transaction",
                          "Wholesale Price",
                        ].map((text, idx) => (
                          <div className="form-check mb-3" key={idx}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`chk_${idx}`}
                            />
                            <label
                              className="form-check-label ms-2"
                              htmlFor={`chk_${idx}`}
                            >
                              {text}
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="col-md-4">
                        <h6 className="fw-bold mt-4">MRP/Price</h6>
                        <div className="form-check d-flex align-items-center gap-3 mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="mrp"
                          />
                          <label className="form-check-label" htmlFor="mrp">
                            MRP
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="MRP"
                            style={{ maxWidth: "140px" }}
                          />
                        </div>

                        <h6 className="fw-bold mt-4">Serial No. Tracking</h6>
                        <div className="form-check d-flex align-items-center gap-3 mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="serial"
                          />
                          <label className="form-check-label" htmlFor="serial">
                            Serial No / IMEI No.
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Serial No."
                            style={{ maxWidth: "140px" }}
                          />
                        </div>

                        <h6 className="fw-bold mt-4">Batch Tracking</h6>

                        <div className="form-check d-flex align-items-center gap-3 mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="batch_no"
                          />
                          <label className="form-check-label" htmlFor="batch_no">
                            Batch No.
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Batch No."
                            style={{ maxWidth: "140px" }}
                          />
                        </div>

                        <div className="form-check d-flex align-items-center gap-3 mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="exp"
                          />
                          <label className="form-check-label" htmlFor="exp">
                            Exp Date
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="mm/yy"
                            style={{ maxWidth: "140px" }}
                          />
                        </div>

                        <div className="form-check d-flex align-items-center gap-3 mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="mfg"
                          />
                          <label className="form-check-label" htmlFor="mfg">
                            Mfg Date
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="dd/mm/yy"
                            style={{ maxWidth: "140px" }}
                          />
                        </div>

                        <div className="form-check d-flex align-items-center gap-3 mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="model"
                          />
                          <label className="form-check-label" htmlFor="model">
                            Model No.
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Model No."
                            style={{ maxWidth: "140px" }}
                          />
                        </div>

                        <div className="form-check d-flex align-items-center gap-3 mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="size"
                          />
                          <label className="form-check-label" htmlFor="size">
                            Size
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Size"
                            style={{ maxWidth: "140px" }}
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <button className="btn btn-outline-primary">
                          Add Custom Fields &gt;
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="d-flex flex-column align-items-center justify-content-center"
                      style={{ minHeight: "400px" }}
                    >
                      <div className="text-center">
                        <i className="fas fa-box-open fa-4x text-muted mb-4"></i>
                        <h4 className="text-muted mb-3">Item is Disabled</h4>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default EstimateCreation;