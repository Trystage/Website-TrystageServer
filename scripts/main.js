// 全局变量
let isScrolling = false;
let scrollTimeout;

// 移动端菜单切换
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // 平滑滚动到锚点
    const links = document.querySelectorAll('a[href^="#"]');
    
    for (const link of links) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // 关闭移动端菜单
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    }
    
    // 滚动时导航栏效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(30, 30, 30, 0.98)';
            navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.4)';
        } else {
            navbar.style.backgroundColor = 'rgba(30, 30, 30, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }
        
        // 更新导航链接的激活状态
        updateNavigationOnScroll();
    });
    
    // 卡片悬停效果增强
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // 动态更新服务器状态（模拟）
    function updateServerStatus() {
        const statusBadges = document.querySelectorAll('.status-badge');
        
        statusBadges.forEach(badge => {
            // 模拟状态变化（实际应用中应该从API获取真实数据）
            const statuses = ['online', 'offline', 'maintenance'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            // 移除现有状态类
            badge.classList.remove('online', 'offline', 'maintenance');
            
            // 添加新状态类
            badge.classList.add(randomStatus);
            
            // 更新文本
            switch(randomStatus) {
                case 'online':
                    badge.textContent = '在线';
                    badge.style.backgroundColor = '#28a745';
                    break;
                case 'offline':
                    badge.textContent = '离线';
                    badge.style.backgroundColor = '#dc3545';
                    break;
                case 'maintenance':
                    badge.textContent = '维护中';
                    badge.style.backgroundColor = '#ffc107';
                    badge.style.color = '#212529';
                    break;
            }
        });
    }
    
    // 每30秒更新一次服务器状态
    setInterval(updateServerStatus, 30000);
    
    // 页面加载完成后初始更新
    updateServerStatus();
});

// 表单验证（如果需要的话）
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// 动画效果初始化
function initAnimations() {
    // 可以在这里添加页面加载动画或其他特效
    document.body.classList.add('loaded');
}

// 页面加载完成后的初始化
window.addEventListener('load', function() {
    initAnimations();
});

function scrollToSection(index) {
    const sections = document.querySelectorAll('section');
    if (index >= 0 && index < sections.length) {
        isScrolling = true;
        const targetTop = sections[index].offsetTop - 70; // Adjust for fixed header
        
        // Use custom smooth scrolling for better control
        const startPosition = window.pageYOffset;
        const distance = targetTop - startPosition;
        const duration = 800; // milliseconds
        let start = null;
        
        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
            else {
                isScrolling = false;
            }
        }
        
        // Easing function for smooth animation
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
        
        // Clear any existing timeout
        if (scrollTimeout) clearTimeout(scrollTimeout);
        
        // Set a timeout to ensure isScrolling is reset even if animation is interrupted
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, duration + 100);
    }
}

// Improved section detection
function getCurrentSectionIndex() {
    const sections = document.querySelectorAll('section');
    let currentSectionIndex = 0;
    
    // Find the section that takes up the most space in the viewport
    let maxVisibleHeight = 0;
    
    for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate visible height of section in viewport
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            currentSectionIndex = i;
        }
    }
    
    return currentSectionIndex;
}

// Improved scroll position detection for navigation links
function updateNavigationOnScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.pageYOffset + window.innerHeight / 3;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Scroll with mouse wheel - with debouncing
let wheelTimeout;
window.addEventListener('wheel', (e) => {
    // Prevent default scrolling behavior completely
    e.preventDefault();
    
    if (isScrolling) return;
    
    // Debounce wheel events
    if (wheelTimeout) clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        const sections = document.querySelectorAll('section');
        const currentSectionIndex = getCurrentSectionIndex();
        
        // Determine the next section based on scroll direction
        const direction = e.deltaY > 0 ? 1 : -1;
        const nextSectionIndex = currentSectionIndex + direction;
        
        // Scroll to the next section if it exists
        scrollToSection(nextSectionIndex);
    }, 50); // 50ms debounce
}, { passive: false }); // Disable passive event listener to allow preventDefault

// Scroll with arrow keys
window.addEventListener('keydown', (e) => {
    if (isScrolling) return;
    
    // Only handle arrow keys
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    
    const sections = document.querySelectorAll('section');
    const currentSectionIndex = getCurrentSectionIndex();
    
    // Determine the next section based on key pressed
    let nextSectionIndex = currentSectionIndex;
    if (e.key === 'ArrowDown') {
        nextSectionIndex = currentSectionIndex + 1;
    } else if (e.key === 'ArrowUp') {
        nextSectionIndex = currentSectionIndex - 1;
    }
    
    // Scroll to the next section if it exists
    scrollToSection(nextSectionIndex);
    
    // Prevent default behavior for arrow keys
    e.preventDefault();
});