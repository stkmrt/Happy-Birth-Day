let currentNoBtnPosition = { x: 0, y: 0 }; // เก็บตำแหน่งปุ่ม No

function nextPage(pageNumber) {
    // ซ่อนทุกหน้า
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // แสดงหน้าถัดไป
    document.getElementById('page' + pageNumber).classList.add('active');

    // รีเซ็ตตำแหน่งปุ่ม No เมื่อเปลี่ยนหน้า
    const noBtn = document.getElementById('noBtn');
    if (noBtn) {
        noBtn.style.position = 'relative'; // กลับไปเป็น relative
        noBtn.style.left = 'auto';
        noBtn.style.top = 'auto';
        noBtn.style.transform = 'translateX(-50%)'; // จัดกึ่งกลางใหม่
        currentNoBtnPosition = { x: 0, y: 0 };
    }
}

function moveButton() {
    const btn = document.getElementById('noBtn');
    if (!btn) return;

    // คำนวณขอบเขตที่ปุ่มสามารถเคลื่อนที่ได้
    const containerRect = btn.parentElement.getBoundingClientRect(); // อ้างอิงจาก parent (.button-group)
    const btnRect = btn.getBoundingClientRect();

    let newX, newY;
    let attempts = 0;
    const maxAttempts = 100;
    const padding = 10; // ระยะห่างจากขอบ

    // สุ่มตำแหน่งใหม่ จนกว่าจะไม่ทับปุ่ม "รับพร" และไม่หลุดขอบ
    do {
        newX = Math.random() * (containerRect.width - btnRect.width - padding * 2) + padding;
        newY = Math.random() * (containerRect.height - btnRect.height - padding * 2) + padding;

        attempts++;
        if (attempts > maxAttempts) break; // ป้องกันการวนลูปไม่สิ้นสุด
    } while (isOverlappingWithYesButton(btn, newX, newY)); // ตรวจสอบว่าทับปุ่ม "รับพร" หรือไม่

    btn.style.position = 'absolute';
    btn.style.left = newX + 'px';
    btn.style.top = newY + 'px';
    btn.style.transform = 'translate(0, 0)'; // ยกเลิก transform เดิม
    currentNoBtnPosition = { x: newX, y: newY };
}

function isOverlappingWithYesButton(noBtn, newNoBtnX, newNoBtnY) {
    const yesBtn = document.querySelector('.btn-yes');
    if (!yesBtn) return false;

    const noBtnRect = {
        left: newNoBtnX,
        top: newNoBtnY,
        right: newNoBtnX + noBtn.offsetWidth,
        bottom: newNoBtnY + noBtn.offsetHeight
    };

    const yesBtnRect = yesBtn.getBoundingClientRect();
    const parentRect = noBtn.parentElement.getBoundingClientRect();

    // แปลง yesBtnRect ให้อยู่ใน coordinate เดียวกับ noBtn (relative to parent)
    const yesBtnRectRelative = {
        left: yesBtnRect.left - parentRect.left,
        top: yesBtnRect.top - parentRect.top,
        right: yesBtnRect.right - parentRect.left,
        bottom: yesBtnRect.bottom - parentRect.top
    };

    // ตรวจสอบการทับซ้อน
    return !(noBtnRect.right < yesBtnRectRelative.left ||
             noBtnRect.left > yesBtnRectRelative.right ||
             noBtnRect.bottom < yesBtnRectRelative.top ||
             noBtnRect.top > yesBtnRectRelative.bottom);
}
