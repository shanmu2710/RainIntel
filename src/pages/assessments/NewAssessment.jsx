import React, { useState, useRef, useEffect } from 'react';
import Button from '../../components/common/Button';
import LucideIcon from '../../components/common/LucideIcon';
import { api } from '../../services/api';

export default function NewAssessment({ onCancel, onSubmit, triggerToast }) {
  const [step, setStep] = useState(1);

  // Valid Form State initialized empty, without mock data
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [elevation, setElevation] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  const [buildingName, setBuildingName] = useState('');
  const [buildingType, setBuildingType] = useState('Select building type');
  const [owner, setOwner] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Select district');
  const [districtsList, setDistrictsList] = useState([]);
  
  const [roofArea, setRoofArea] = useState('');
  const [roofMaterial, setRoofMaterial] = useState('Select option');
  const [roofSlope, setRoofSlope] = useState('Select option');
  
  const [images, setImages] = useState({
    roof: null,
    building: null,
    site: null,
  });

  const fileInputRefs = {
    roof: useRef(null),
    building: useRef(null),
    site: useRef(null),
  };

  useEffect(() => {
    async function fetchDistricts() {
      try {
        const dStr = await api.districts.getAll();
        setDistrictsList(dStr || []);
      } catch (err) {
        console.error('Failed to load districts from API', err);
      }
    }
    fetchDistricts();
  }, []);

  const steps = [
    'Building details',
    'GPS location',
    'Roof details',
    'Images',
    'Review',
  ];

  const stepData = {
    1: [
      'Building details',
      'Enter the basic information for this assessment site.',
      'All fields marked are required to proceed.',
    ],
    2: [
      'GPS location',
      'Confirm the exact rooftop location using live GIS coordinates.',
      'Map pin, satellite imagery, and coordinate accuracy are ready for capture.',
    ],
    3: [
      'Roof details',
      'Capture the rooftop dimensions and catchment characteristics.',
      'Required for calculating harvest capacity efficiently.',
    ],
    4: [
      'Site images',
      'Upload clear images for AI validation and automated report evidence.',
      '',
    ],
    5: [
      'Review assessment',
      'Review all captured information before submitting the assessment.',
      '',
    ],
  };

  const currentStepInfo = stepData[step];

  const handleToast = (msg) => {
    if (triggerToast) triggerToast(msg);
  };

  const handleFileClick = (key) => {
    if (fileInputRefs[key].current) {
      fileInputRefs[key].current.click();
    }
  };

  const handleFileChange = (key, e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImages((prev) => ({ ...prev, [key]: url }));
      handleToast(`Selected ${file.name} for ${key} photo.`);
    }
  };

  const handleRemoveImage = (key, e) => {
    e.stopPropagation();
    setImages((prev) => ({ ...prev, [key]: null }));
    handleToast(`Removed ${key} photo.`);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      handleToast('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    handleToast('Acquiring GPS fix...');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const acc = position.coords.accuracy;
        setLatitude(lat.toFixed(6) + '° N');
        setLongitude(lon.toFixed(6) + '° E');
        setAccuracy(acc.toFixed(1) + ' m');
        setElevation('Tracking...');
        handleToast('GPS fixed. Querying GIS layers...');
        
        try {
          const gisData = await api.gis.lookup(lat, lon);
          if (gisData) {
            setElevation((gisData.elevation || 14) + ' m');
            if (gisData.districtName) {
              const matched = districtsList.find(d => 
                d.districtName && d.districtName.toLowerCase() === gisData.districtName.toLowerCase()
              );
              if (matched) {
                setDistrict(String(matched.districtId));
              } else {
                setDistrict(gisData.districtName);
              }
            }
            handleToast(`GIS layered saved: ${gisData.districtName || 'Unknown'}`);
          } else {
             setElevation('14 m');
          }
        } catch (err) {
          console.error('GIS Error', err);
          handleToast('GIS lookup failed. Please select your district manually.');
          setElevation('Unknown');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error(error);
        handleToast('Failed to acquire GPS fix. Check permissions.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
            <label>
              Building name
              <input
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                placeholder="Name of building"
              />
            </label>
            <label>
              Building type
              <select value={buildingType} onChange={(e) => setBuildingType(e.target.value)}>
                <option value="Select building type">Select building type</option>
                <option value="Government">Government</option>
                <option value="Educational">Educational</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
              </select>
            </label>
            <label>
              Owner / organisation
              <input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Enter owner name"
              />
            </label>
            <label>
              Mobile number
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91"
              />
            </label>
            <label className="wide">
              Site address
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete address"
              />
            </label>
            <label>
              District
              <select value={district} onChange={(e) => setDistrict(e.target.value)}>
                <option value="Select district">Select district</option>
                {districtsList.map(d => (
                  <option key={d.districtId} value={d.districtId}>
                    {d.districtName}{d.stateName ? ` — ${d.stateName}` : ''}
                  </option>
                ))}
              </select>
            </label>
          </form>
        );

      case 2:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>
            <div className="map-canvas" style={{ height: '370px' }}>
              <span className="pin one">
                <i><LucideIcon name="map-pin" /></i>
              </span>
              <div className="map-tools">
                <button type="button" onClick={() => handleToast('Zoom functionality initialized.')}>
                  <LucideIcon name="plus" />
                </button>
                <button type="button" onClick={() => handleToast('Zoom out functionality initialized.')}>
                  <LucideIcon name="minus" />
                </button>
              </div>
              <div className="map-card">
                <b>{buildingName || 'Building Location'}</b>
                <p>{latitude || 'Coordinates pending'}, {longitude || ''} • Accuracy {accuracy || 'Unknown'}</p>
                {latitude && <span className="status done">GPS locked</span>}
              </div>
            </div>
            <div className="card" style={{ padding: '15px', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>GIS Site Coordinates</h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 600 }}>
                    Latitude
                    <input value={latitude} readOnly placeholder="Latitude" style={{ width: '100%', height: '30px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0 8px', marginTop: '4px', background: '#f8fafc' }} />
                  </label>
                  <label style={{ fontSize: '10px', fontWeight: 600 }}>
                    Longitude
                    <input value={longitude} readOnly placeholder="Longitude" style={{ width: '100%', height: '30px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0 8px', marginTop: '4px', background: '#f8fafc' }} />
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Button variant="secondary" style={{ padding: '6px 10px', fontSize: '11px' }} onClick={handleLocateMe} disabled={isLocating}>
                    {isLocating ? 'Locating...' : 'Locate me'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-grid">
            <label>
              Roof area (sq ft)
              <input value={roofArea} type="number" onChange={(e) => setRoofArea(e.target.value)} placeholder="e.g. 1500" />
            </label>
            <label>
              Roof material
              <select value={roofMaterial} onChange={(e) => setRoofMaterial(e.target.value)}>
                <option value="Select option">Select option</option>
                <option value="Reinforced concrete">Reinforced concrete (RCC)</option>
                <option value="Galvanized metal sheet">Galvanized metal sheet</option>
                <option value="Asbestos sheet">Asbestos sheet</option>
                <option value="Baked tiles">Baked tiles</option>
                <option value="Thatched/Organic">Thatched/Organic</option>
              </select>
            </label>
            <label>
              Roof slope
              <select value={roofSlope} onChange={(e) => setRoofSlope(e.target.value)}>
                <option value="Select option">Select option</option>
                <option value="0.0">Flat (0 degrees)</option>
                <option value="2.0">Mild Slope (2 degrees)</option>
                <option value="5.0">Standard Pitch (5 degrees)</option>
                <option value="15.0">Steep Pitch (15+ degrees)</option>
              </select>
            </label>
          </div>
        );

      case 4:
        const fileUploads = [
          { key: 'roof', name: 'Roof photo' },
          { key: 'building', name: 'Building photo' },
          { key: 'site', name: 'Site photo' },
        ];
        return (
          <div className="upload-grid">
            {fileUploads.map((up) => (
              <div
                key={up.key}
                className="upload"
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  backgroundImage: images[up.key] ? `url(${images[up.key]})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '142px',
                }}
                onClick={() => handleFileClick(up.key)}
              >
                <input
                  type="file"
                  ref={fileInputRefs[up.key]}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => handleFileChange(up.key, e)}
                />
                {!images[up.key] ? (
                  <>
                    <LucideIcon name="upload-cloud" />
                    <b>{up.name}</b>
                    <small>Drag & drop or browse files</small>
                  </>
                ) : (
                  <button
                    type="button"
                    style={{
                      position: 'absolute', top: '8px', right: '8px', background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white', border: '0', borderRadius: '50%', width: '24px', height: '24px',
                      cursor: 'pointer', display: 'grid', placeItems: 'center',
                    }}
                    onClick={(e) => handleRemoveImage(up.key, e)}
                  >
                    <LucideIcon name="trash-2" style={{ width: '13px', color: '#fff' }} />
                  </button>
                )}
              </div>
            ))}
          </div>
        );

      case 5:
        const reviewItems = [
          ['Building', buildingName || 'Pending'],
          ['Owner', owner || 'Pending'],
          ['Location', address || 'Pending'],
          ['District', district !== 'Select district' ? (districtsList.find(d => String(d.districtId) === String(district))?.districtName || district) : 'Pending'],
          ['Roof area', roofArea ? `${Math.round(roofArea)} sq ft` : 'Pending'],
          ['Roof material', roofMaterial !== 'Select option' ? roofMaterial : 'Pending'],
          ['Coordinates', latitude ? `${latitude}, ${longitude}` : 'Pending'],
        ];
        return (
          <div className="review-grid">
            {reviewItems.map((item, idx) => (
              <div key={idx} className="summary-item">
                <small>{item[0]}</small>
                <b>{item[1]}</b>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page">
      <div className="assessment-head">
        <button className="back" onClick={onCancel}>
          <LucideIcon name="arrow-left" />
          Dashboard
        </button>
        <h2>New rooftop assessment</h2>
        <p>Capture site data to generate a detailed water harvesting recommendation.</p>
      </div>

      <div className="steps">
        {steps.map((x, i) => (
          <React.Fragment key={i}>
            <div className={`step ${i + 1 === step ? 'active' : ''}`}>
              <b>{i + 1}</b>
              <span>{x}</span>
            </div>
            {i < steps.length - 1 && <i></i>}
          </React.Fragment>
        ))}
      </div>

      <article className="form-card">
        <div>
          <h3>{currentStepInfo[0]}</h3>
          <p dangerouslySetInnerHTML={{ __html: currentStepInfo[2] }}></p>
        </div>

        {renderContent()}

        <div className="form-footer">
          <span>
            {step === 1
              ? 'All fields marked are required to proceed.'
              : `Step ${step} of ${steps.length}`}
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            {step > 1 && (
              <Button variant="secondary" icon="arrow-left" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button
              variant="primary"
              icon={step === steps.length ? 'check' : 'arrow-right'}
              iconPosition="right"
              onClick={() => {
                if (step === 1 && !buildingName) {
                  handleToast('Building name is required to proceed.');
                  return;
                }
                if (step < steps.length) {
                  setStep(step + 1);
                } else {
                  if (buildingType === 'Select building type') {
                    handleToast('Please select a building type.');
                    return;
                  }
                  if (district === 'Select district') {
                    handleToast('Please select a valid district.');
                    return;
                  }
                  const areaNum = parseFloat(String(roofArea).replace(/,/g, ''));
                  if (!areaNum || isNaN(areaNum)) {
                    handleToast('Valid roof area is required for assessment.');
                    return;
                  }
                  const parsedLat = parseFloat((latitude || '').replace(/[a-zA-Z°\s]/g, ''));
                  const parsedLon = parseFloat((longitude || '').replace(/[a-zA-Z°\s]/g, ''));
                  if (!parsedLat || !parsedLon) {
                    handleToast('Please capture GPS coordinates using Locate Me.');
                    return;
                  }
                  
                  const selectedObj = districtsList.find(d => String(d.districtId) === String(district));
                  const finalDistrictName = selectedObj ? selectedObj.districtName : district;

                  const payload = {
                    buildingName,
                    buildingType,
                    address,
                    districtName: finalDistrictName,
                    latitude: parsedLat,
                    longitude: parsedLon,
                    roofAreaSqFt: areaNum,
                    roofMaterial: roofMaterial === 'Select option' ? 'Unknown' : roofMaterial,
                    roofSlope: roofSlope === 'Select option' ? 0.0 : parseFloat(roofSlope),
                    waterDemandLpd: 500.0,
                    purpose: 'Rainwater harvesting feasibility'
                  };
                  onSubmit(payload);
                }
              }}
            >
              {step === steps.length ? 'Submit assessment' : 'Continue'}
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
