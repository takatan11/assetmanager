const API_URL = 'http://localhost:3000/api';

// DOM elements
const assetForm = document.getElementById('asset-form');
const assetsContainer = document.getElementById('assets-container');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const assetIdInput = document.getElementById('asset-id');

// Form fields
const nameInput = document.getElementById('name');
const categoryInput = document.getElementById('category');
const purchaseDateInput = document.getElementById('purchase-date');
const purchasePriceInput = document.getElementById('purchase-price');
const statusInput = document.getElementById('status');
const descriptionInput = document.getElementById('description');

let editMode = false;

// Load assets on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAssets();
});

// Handle form submission
assetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const assetData = {
        name: nameInput.value,
        category: categoryInput.value,
        purchase_date: purchaseDateInput.value,
        purchase_price: purchasePriceInput.value ? parseFloat(purchasePriceInput.value) : null,
        status: statusInput.value,
        description: descriptionInput.value
    };

    try {
        if (editMode) {
            await updateAsset(assetIdInput.value, assetData);
        } else {
            await createAsset(assetData);
        }
        resetForm();
        loadAssets();
    } catch (error) {
        alert('エラーが発生しました: ' + error.message);
    }
});

// Cancel button
cancelBtn.addEventListener('click', () => {
    resetForm();
});

// Load all assets
async function loadAssets() {
    try {
        const response = await fetch(`${API_URL}/assets`);
        const data = await response.json();
        
        if (data.assets && data.assets.length > 0) {
            displayAssets(data.assets);
        } else {
            assetsContainer.innerHTML = '<div class="empty-state"><p>まだ資産が登録されていません</p><p>No assets registered yet</p></div>';
        }
    } catch (error) {
        assetsContainer.innerHTML = '<div class="empty-state"><p>エラーが発生しました</p><p>Error loading assets</p></div>';
        console.error('Error loading assets:', error);
    }
}

// Display assets
function displayAssets(assets) {
    assetsContainer.innerHTML = assets.map(asset => `
        <div class="asset-card">
            <div class="asset-header">
                <div>
                    <div class="asset-title">${escapeHtml(asset.name)}</div>
                    <span class="asset-category">${escapeHtml(asset.category)}</span>
                </div>
            </div>
            <div class="asset-details">
                ${asset.purchase_date ? `<p>購入日: ${formatDate(asset.purchase_date)}</p>` : ''}
                ${asset.purchase_price ? `<p>購入価格: ¥${formatPrice(asset.purchase_price)}</p>` : ''}
                <p>ステータス: <span class="asset-status status-${asset.status}">${getStatusLabel(asset.status)}</span></p>
                ${asset.description ? `<p>説明: ${escapeHtml(asset.description)}</p>` : ''}
            </div>
            <div class="asset-actions">
                <button class="btn btn-edit" onclick="editAsset(${asset.id})">編集</button>
                <button class="btn btn-delete" onclick="deleteAsset(${asset.id})">削除</button>
            </div>
        </div>
    `).join('');
}

// Create new asset
async function createAsset(assetData) {
    const response = await fetch(`${API_URL}/assets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(assetData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to create asset');
    }
    
    return response.json();
}

// Update asset
async function updateAsset(id, assetData) {
    const response = await fetch(`${API_URL}/assets/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(assetData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to update asset');
    }
    
    return response.json();
}

// Edit asset
async function editAsset(id) {
    try {
        const response = await fetch(`${API_URL}/assets/${id}`);
        const data = await response.json();
        const asset = data.asset;
        
        // Populate form
        assetIdInput.value = asset.id;
        nameInput.value = asset.name;
        categoryInput.value = asset.category;
        purchaseDateInput.value = asset.purchase_date || '';
        purchasePriceInput.value = asset.purchase_price || '';
        statusInput.value = asset.status;
        descriptionInput.value = asset.description || '';
        
        // Update UI
        editMode = true;
        formTitle.textContent = '資産を編集';
        submitBtn.textContent = '更新';
        cancelBtn.style.display = 'inline-block';
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        alert('資産の読み込みに失敗しました');
        console.error('Error loading asset:', error);
    }
}

// Delete asset
async function deleteAsset(id) {
    if (!confirm('この資産を削除してもよろしいですか？')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/assets/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete asset');
        }
        
        loadAssets();
    } catch (error) {
        alert('削除に失敗しました: ' + error.message);
        console.error('Error deleting asset:', error);
    }
}

// Reset form
function resetForm() {
    assetForm.reset();
    assetIdInput.value = '';
    editMode = false;
    formTitle.textContent = '資産を追加';
    submitBtn.textContent = '追加';
    cancelBtn.style.display = 'none';
}

// Helper functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
}

function formatPrice(price) {
    return new Intl.NumberFormat('ja-JP').format(price);
}

function getStatusLabel(status) {
    const labels = {
        'active': 'アクティブ',
        'inactive': '非アクティブ',
        'disposed': '廃棄済み'
    };
    return labels[status] || status;
}
