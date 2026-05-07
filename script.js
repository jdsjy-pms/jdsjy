document.addEventListener('DOMContentLoaded', function() {
    // Client login
    document.getElementById('client-login')?.addEventListener('submit', function(e) {
        e.preventDefault();
        window.location.href = 'client.html';
    });

    // Editor login
    document.getElementById('editor-login')?.addEventListener('submit', function(e) {
        e.preventDefault();
        window.location.href = 'editor.html';
    });

    // Admin login
    document.getElementById('admin-login')?.addEventListener('submit', function(e) {
        e.preventDefault();
        window.location.href = 'admin.html';
    });

    // Client page functionality
    if (window.location.pathname.endsWith('client.html')) {
        // Add row functionality
        document.getElementById('add-row')?.addEventListener('click', function() {
            const table = document.getElementById('project-table').getElementsByTagName('tbody')[0];
            const newRow = table.insertRow();

            newRow.innerHTML = `
                <td><input type="text"></td>
                <td><input type="text"></td>
                <td><input type="text"></td>
                <td><input type="number"></td>
                <td><input type="text"></td>
                <td><input type="text"></td>
                <td><input type="text"></td>
                <td><button class="delete-row" style="background: var(--notion-button-red); color: white;">删除</button></td>
            `;

            // Add delete functionality to new row
            newRow.querySelector('.delete-row')?.addEventListener('click', function() {
                table.deleteRow(newRow.rowIndex - 1);
            });
        });

        // Delete row functionality for existing rows
        document.querySelectorAll('.delete-row')?.forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                row?.parentNode?.removeChild(row);
            });
        });

        // Submit data functionality
        document.getElementById('submit-data')?.addEventListener('click', function() {
            const table = document.getElementById('project-table');
            const rows = table?.getElementsByTagName('tbody')[0]?.rows || [];
            const data = [];

            for (let i = 0; i < rows.length; i++) {
                const cells = rows[i].cells;
                data.push({
                    scope: cells[0]?.querySelector('input')?.value || '',
                    building: cells[1]?.querySelector('input')?.value || '',
                    content: cells[2]?.querySelector('input')?.value || '',
                    quantity: cells[3]?.querySelector('input')?.value || '',
                    requirements: cells[4]?.querySelector('input')?.value || '',
                    currentStatus: cells[5]?.querySelector('input')?.value || '',
                    postLevel: cells[6]?.querySelector('input')?.value || ''
                });
            }

            // Save to localStorage as project data
            localStorage.setItem('projectData', JSON.stringify(data));
            localStorage.setItem('projectDataTimestamp', new Date().toISOString());
            alert('数据提交成功！');
        });

        // File upload functionality
        document.getElementById('add-file')?.addEventListener('click', function() {
            const fileInput = document.getElementById('file-upload');
            const comments = document.getElementById('file-comments')?.value || '';
            const table = document.getElementById('materials-table')?.getElementsByTagName('tbody')[0];

            if (fileInput?.files?.length > 0) {
                const newRow = table.insertRow();
                const fileName = fileInput.files[0].name;

                newRow.innerHTML = `
                    <td>${fileName}</td>
                    <td>${comments}</td>
                    <td><input type="checkbox" class="private-toggle"></td>
                    <td>
                        <button class="delete-file" style="background: var(--notion-button-red); color: white;">删除</button>
                    </td>
                `;

                // Add delete functionality
                newRow.querySelector('.delete-file')?.addEventListener('click', function() {
                    table.deleteRow(newRow.rowIndex - 1);
                });

                fileInput.value = '';
                document.getElementById('file-comments').value = '';
            }
        });

        // Submit materials functionality
        document.getElementById('submit-materials')?.addEventListener('click', function() {
            const table = document.getElementById('materials-table');
            const rows = table?.getElementsByTagName('tbody')[0]?.rows || [];
            const materials = [];

            for (let i = 0; i < rows.length; i++) {
                const cells = rows[i].cells;
                materials.push({
                    filename: cells[0]?.textContent || '',
                    comments: cells[1]?.textContent || '',
                    isPrivate: cells[2]?.querySelector('input')?.checked || false
                });
            }

            // Save to localStorage as materials data
            localStorage.setItem('materialsData', JSON.stringify(materials));
            localStorage.setItem('materialsDataTimestamp', new Date().toISOString());
            alert('材料提交成功！');
        });
    }

    // Editor page functionality
    if (window.location.pathname.endsWith('editor.html')) {
        // Mark project as in progress
        document.getElementById('mark-in-progress')?.addEventListener('click', function() {
            const status = document.getElementById('project-status');
            localStorage.setItem('projectStatus', 'in-progress');
            localStorage.setItem('projectStatusTimestamp', new Date().toISOString());
            status.textContent = '进行中';
            status.className = 'status-badge status-in-progress';
            alert('项目标记为进行中。客户将无法查看最新版本。');
        });
    }
});