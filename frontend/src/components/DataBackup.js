import React, { useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { cyclesAPI, symptomsAPI } from '../services/api';

function DataBackup() {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      const [cyclesRes, symptomsRes, statsRes] = await Promise.all([
        cyclesAPI.getCycles(),
        symptomsAPI.getSymptoms(),
        cyclesAPI.getStats()
      ]);

      const backupData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        data: {
          cycles: cyclesRes.data.cycles || [],
          symptoms: symptomsRes.data.symptoms || [],
          stats: statsRes.data || {}
        }
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `aura-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Data exported successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setMessage({ type: 'error', text: 'Failed to export data' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const text = await file.text();
      const backupData = JSON.parse(text);

      // Validate backup structure
      if (!backupData.version || !backupData.data) {
        throw new Error('Invalid backup file format');
      }

      // Import cycles
      if (backupData.data.cycles && backupData.data.cycles.length > 0) {
        for (const cycle of backupData.data.cycles) {
          try {
            await cyclesAPI.addCycle({
              start_date: cycle.start_date,
              end_date: cycle.end_date,
              flow_intensity: cycle.flow_intensity || 'medium'
            });
          } catch (err) {
            console.error('Error importing cycle:', err);
          }
        }
      }

      // Import symptoms
      if (backupData.data.symptoms && backupData.data.symptoms.length > 0) {
        for (const symptom of backupData.data.symptoms) {
          try {
            // Handle different symptom data structures
            let symptomsArray = [];
            if (symptom.symptoms && Array.isArray(symptom.symptoms)) {
              symptomsArray = symptom.symptoms;
            } else if (symptom.symptoms && typeof symptom.symptoms === 'object') {
              symptomsArray = Object.keys(symptom.symptoms);
            } else {
              // Extract active symptoms from individual properties
              Object.keys(symptom).forEach(key => {
                if (symptom[key] && typeof symptom[key] === 'object' && symptom[key].active) {
                  symptomsArray.push(key);
                }
              });
            }
            
            await symptomsAPI.addSymptom({
              date: symptom.date,
              mood: symptom.mood,
              pain_level: symptom.pain_level,
              symptoms: symptomsArray,
              notes: symptom.notes || ''
            });
          } catch (err) {
            console.error('Error importing symptom:', err);
          }
        }
      }

      setMessage({ type: 'success', text: 'Data imported successfully! Refresh to see changes.' });
      setTimeout(() => {
        setMessage(null);
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Import error:', error);
      setMessage({ type: 'error', text: 'Failed to import data. Please check file format.' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="data-backup-card">
      <h3>Data Backup & Restore</h3>
      <p className="backup-description">
        Export your data for safekeeping or import from a previous backup.
      </p>

      <div className="backup-actions">
        <button 
          onClick={handleExport} 
          className="btn-primary"
          disabled={loading}
        >
          <Download size={20} />
          <span>Export Data</span>
        </button>

        <label className="btn-secondary" style={{cursor: 'pointer'}}>
          <Upload size={20} />
          <span>Import Data</span>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{display: 'none'}}
            disabled={loading}
          />
        </label>
      </div>

      {message && (
        <div className={`backup-message ${message.type}`}>
          {message.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="backup-info">
        <AlertCircle size={16} />
        <p>
          <strong>Note:</strong> Importing will add data to your existing records. 
          It won't delete current data. Export format: JSON
        </p>
      </div>
    </div>
  );
}

export default DataBackup;
