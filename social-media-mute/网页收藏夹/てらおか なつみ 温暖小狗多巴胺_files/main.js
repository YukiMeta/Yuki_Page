// DEBUG: This is a test line. Delete later.
console.log("main.js: A new line has been added to the top.");
console.log('main.jsファイルが読み込まれました！');

// ----------------------------------------------------------------
//      Barba.jsのフックを利用してオープニングアニメーションを制御する関数
// ----------------------------------------------------------------
function setupBarbaAnimationControl() {
    // 遷移前に実行されるフック
    barba.hooks.before(() => {
        // Barba.jsの遷移が始まる直前に、アニメーション関連要素をすべて削除する
        const loaderWhite = document.getElementById('loader-white');
        const curtain = document.getElementById('curtain');
        const logo = document.querySelector('.fade-in-out-custom');

        if (loaderWhite) {
            loaderWhite.remove();
        }
        if (curtain) {
            curtain.remove();
        }
        if (logo) {
            logo.remove();
        }
    });
}

// ----------------------------------------------------------------
//     モーダルを初期化する関数（修正版）
// ----------------------------------------------------------------
function initModal() {
    const handleModal = (targetSelector, open = true) => {
        const modalElement = document.querySelector(targetSelector);
        if (!modalElement) {
            console.warn(`Modal element not found for selector: ${targetSelector}`);
            return;
        }

        modalElement.classList.toggle('hidden', !open);

        if (open) {
            // モーダルが開いた直後にその中のSwiperを更新
            const swiperEl = modalElement.querySelector('.swiper');
            if (swiperEl && swiperEl.swiper) { // Swiperインスタンスが存在していれば
                swiperEl.swiper.update(); // Swiperのレイアウトを更新
                swiperEl.swiper.slideTo(0, 0); // 最初のスライドに戻す
                console.log(`Swiper updated on modal open for ID: ${modalElement.id}`);
            } else if (swiperEl) { // Swiperインスタンスがまだなければ（初回など）
                // 通常、initSwipers() で初回初期化は済んでいるはずなので、
                // ここはwarningまたは何もしないで良いが、デバッグ目的でログを残すのはあり。
                // あるいは、特定のモーダルが遅延初期化を必要とする場合は、ここで初期化することもできる。
                console.warn(`Swiper instance not ready on modal open for ID: ${modalElement.id}. ` + `Ensure initSwipers() has been called and Swiper element exists.`);
            }
        }
    };

    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        // Barba.js 遷移でイベントリスナーが重複しないように、既存のものを削除してから追加
        if (trigger._modalClickHandler) {
            trigger.removeEventListener('click', trigger._modalClickHandler);
        }
        trigger._modalClickHandler = () => handleModal(`#${trigger.dataset.modalTarget}`, true);
        trigger.addEventListener('click', trigger._modalClickHandler);
    });

    document.querySelectorAll('.js-modal-close').forEach(closeBtn => {
        if (closeBtn._modalCloseHandler) {
            closeBtn.removeEventListener('click', closeBtn._modalCloseHandler);
        }
        closeBtn._modalCloseHandler = () => {
            // closeBtnの親要素であるモーダルを見つけて、そのIDを使って閉じる
            const modalToClose = closeBtn.closest('.js-modal');
            if (modalToClose) {
                handleModal(`#${modalToClose.id}`, false);
            } else {
                // 万が一見つからない場合は、汎用セレクターで閉じる（ただし推奨されない）
                handleModal('.modal', false);
            }
        };
        closeBtn.addEventListener('click', closeBtn._modalCloseHandler);
    });

    document.querySelectorAll('.js-modal').forEach(modal => { // .modal ではなく .js-modal に合わせる
        if (modal._modalOverlayClickHandler) {
            modal.removeEventListener('click', modal._modalOverlayClickHandler);
        }
        modal._modalOverlayClickHandler = e => {
            if (e.target === modal) {
                handleModal(`#${modal.id}`, false);
            }
        };
        modal.addEventListener('click', modal._modalOverlayClickHandler);
    });
}

// ----------------------------------------------------------------
//     Swiperを初期化する関数
// ----------------------------------------------------------------
function initSwipers() {
    const initSingleSwiper = (selector, options) => {
        const el = document.querySelector(selector);
        if (el && el.swiper) {
            // 既存のSwiperインスタンスがあれば破棄
            el.swiper.destroy(true, true);
        }
        if (el) new Swiper(el, options);
    };

    // 下層ページ汎用swiper
    initSingleSwiper('.swiper-default', {
        slidesPerView: 1.2, spaceBetween: 12, slidesOffsetBefore: 20, slidesOffsetAfter: 16,
        navigation: { nextEl: '.default-swiper-next', prevEl: '.default-swiper-prev' },
        breakpoints: { 1280: { slidesPerView: 'auto', spaceBetween: 36, slidesOffsetBefore: 0, slidesOffsetAfter: 36 } },
    });

    // ホームページ専用のeventsセクションswiper
    initSingleSwiper('.swiper-event', {
        slidesPerView: 1.2,
        spaceBetween: 12,
        slidesOffsetBefore: 20,
        slidesOffsetAfter: 16,
        navigation: { nextEl: '.event-swiper-next', prevEl: '.event-swiper-prev' },
        breakpoints: {
            768: {
                slidesPerView: 'auto',
                spaceBetween: 16
            },
            1280: {
                slidesPerView: '2',
                spaceBetween: 36,
                slidesOffsetBefore: 0,
                slidesOffsetAfter: 36
            }
        },
    });

    // ホームページ専用のworksセクションswiper
    initSingleSwiper('.swiper-home-works', {
        slidesPerView: 1.2,
        spaceBetween: 12,
        // slidesOffsetBefore: 20,
        // slidesOffsetAfter: 16,
        loop: true,
        centeredSlides: true,
        initialSlide: 0,

        // ★ 追加: 自動再生
        autoplay: {
            delay: 4000, // 4秒ごとにスライド
            disableOnInteraction: false, // ユーザーが操作した後も自動再生を続ける
            waitForTransition: false,    // アニメーションの完了を待たずにタイマーを開始
        },

        // ★ 追加: ページネーション（ドット）
        pagination: {
            el: '.swiper-pagination-works', // ドットを表示するコンテナのセレクタ
            clickable: true, // ドットのクリックでスライドを切り替え可能にする
        },

        navigation: { nextEl: '.default-swiper-next', prevEl: '.default-swiper-prev' },
        breakpoints: {
            1280: {
                slidesPerView: 'auto',
                spaceBetween: 36,
                // slidesOffsetBefore: 0,
                // slidesOffsetAfter: 36,
            }
        },
    });

    const thumbEl = document.querySelector('.goods-thumb');
    const mainEl = document.querySelector('.goods-main');

    if (thumbEl && mainEl) {
        if (thumbEl.swiper) thumbEl.swiper.destroy(true, true);
        if (mainEl.swiper) mainEl.swiper.destroy(true, true);

        const thumbSwiper = new Swiper(thumbEl, {
            slidesPerView: 4, spaceBetween: 12, watchSlidesProgress: true,
            breakpoints: { 0: { slidesPerView: 5, spaceBetween: 8 }, 640: { slidesPerView: 4 } }
        });

        new Swiper(mainEl, {
            spaceBetween: 36,
            navigation: { nextEl: '.goods-swiper-next', prevEl: '.goods-swiper-prev' },
            pagination: { el: '.goods-swiper-pagination', clickable: true },
            thumbs: { swiper: thumbSwiper },
            breakpoints: { 0: { slidesPerView: 1 }, 640: { slidesPerView: 1 } }
        });
    }

    document.querySelectorAll('.js-modal').forEach(modal => {
        const swiperEl = modal.querySelector('.swiper');
        if (swiperEl) {
            if (swiperEl.swiper) swiperEl.swiper.destroy(true, true);

            const paginationEl = modal.querySelector('.swiper-pagination');
            const nextEl = modal.querySelector('.modal-swiper-next');
            const prevEl = modal.querySelector('.modal-swiper-prev');

            const swiperOptions = {
                slidesPerView: 1,
                spaceBetween: 36,
                centeredSlides: true,
                initialSlide: 0,
                loop: false, // ★★★ ループを常に無効化 ★★★
            };

            // ページネーションとナビゲーションは、要素が存在する場合にのみ追加
            if (paginationEl) {
                swiperOptions.pagination = { el: paginationEl, clickable: true };
            }
            if (nextEl && prevEl) {
                swiperOptions.navigation = { nextEl: nextEl, prevEl: prevEl };
            }

            new Swiper(swiperEl, swiperOptions);
            console.log(`Swiper in modal initialized for modal ID: ${modal.id} with loop disabled.`);

        } else {
            console.warn(`Swiper element not found in modal ID: ${modal.id}.`);
        }
    });
}

// ----------------------------------------------------------------
//     アコーディオンを初期化する関数
// ----------------------------------------------------------------
function initAccordion() {
    const accordionContainers = document.querySelectorAll('.border-b');

    accordionContainers.forEach((container, index) => {
        const button = container.querySelector('.js-accordion-button');
        if (!button) return;

        const content = container.querySelector('.js-accordion-content');
        const iconContainer = button.querySelector('.js-accordion-icon');
        if (!iconContainer) {
            console.warn('Accordion icon container not found for this accordion item.');
        }

        const plusIcon = iconContainer ? iconContainer.querySelector('.icon-plus') : null;
        const minusIcon = iconContainer ? iconContainer.querySelector('.icon-minus') : null;

        if (index === 0 && content) {
            content.classList.remove('hidden');
            button.setAttribute('aria-expanded', 'true');
            button.classList.add('open');
            if (plusIcon && minusIcon) {
                plusIcon.classList.add('hidden');
                minusIcon.classList.remove('hidden');
            }
        }

        // イベントリスナーの再登録（重複を防ぐ）
        if (button._accordionClickHandler) {
            button.removeEventListener('click', button._accordionClickHandler);
        }
        button._accordionClickHandler = () => {
            if (content) {
                content.classList.toggle('hidden');
                const isExpanded = !content.classList.contains('hidden');
                button.setAttribute('aria-expanded', isExpanded.toString());
                button.classList.toggle('open', isExpanded);
                if (plusIcon && minusIcon) {
                    plusIcon.classList.toggle('hidden');
                    minusIcon.classList.toggle('hidden');
                }
            }
        };
        button.addEventListener('click', button._accordionClickHandler);
    });
}

// ----------------------------------------------------------------
//     価格にカンマをつける（Goods-page）を初期化する関数
// ----------------------------------------------------------------
function initPriceFormatter() {
    const formatPrice = (el) => {
        const value = el.textContent.trim();
        if (!isNaN(value) && value !== '') {
            el.textContent = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    };
    document.querySelectorAll('.price').forEach(formatPrice);
}

// ----------------------------------------------------------------
//     top-page goodsアニメーション
// ----------------------------------------------------------------
function initTopPageGoodsAnimation() {
    const track = document.querySelector('.slide-track');
    if (track) {
        const slide = track.querySelector('.top-slide1');
        if (slide) {
            const slideWidth = slide.offsetWidth;
            track.style.setProperty('--slideWidth', `${slideWidth}px`);
            // アニメーションを一時停止・再開することで、Barba.js 遷移後も正しく動作させる
            track.style.animation = 'none';
            void track.offsetWidth; // 強制的にリフロー
            track.style.animation = `slide-left ${slideWidth / 50}s linear infinite`;
        }
    }
}

// ----------------------------------------------------------------
//     top-page パララックス
// ----------------------------------------------------------------
function initParallax() {
    // スロットリング関数
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    };

    const applyParallax = () => {
        const screenWidth = window.innerWidth;
        const XL_BREAKPOINT = 1280; // Tailwind CSSのXLブレークポイントに合わせる

        // PC向けのパララックス要素
        const parallaxBgImg = document.getElementById('parallaxBgImg');
        const parallaxSmallElements = document.querySelectorAll('.parallax-small');
        const parallaxElements = document.querySelectorAll('.parallax');
        const parallaxElements2 = document.querySelectorAll('.parallax-2');

        // モバイル向け背景を持つ要素
        const topNewsAboutSection = document.querySelector('.top-news-about');

        // 1280px未満の場合の処理
        if (screenWidth < XL_BREAKPOINT) {
            // PC向けのパララックス効果を無効化し、位置をリセット
            parallaxSmallElements.forEach(element => {
                element.style.transform = `translateY(0px)`;
            });
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(0px)`;
            });
            parallaxElements2.forEach(element => {
                element.style.transform = `translateY(0px)`;
            });
            if (parallaxBgImg) {
                parallaxBgImg.style.transform = `translateY(0px) scale(1.0)`;
            }

            // モバイルで背景画像をスクロールに追従させる（擬似 fixed）
            if (topNewsAboutSection) {
                // topNewsAboutSection がビューポートのどこにあるかを取得
                const rect = topNewsAboutSection.getBoundingClientRect();
                // スクロール位置に応じて背景の Y ポジションを調整
                // 要素のスクロール量に対する割合で動かす
                // 0.5 は背景が半分の速度で動くことを意味する (パララックス効果)
                const scrollSpeed = 0.3; // 調整可能。小さいほどゆっくり動く
                const backgroundY = (rect.top * -1 * scrollSpeed); // top が負の値になるので -1 を掛ける

                // transform: translateY を使うことで、background-position よりパフォーマンスが良いことが多い
                topNewsAboutSection.style.backgroundPosition = `center ${backgroundY}px`;
                // background-size: cover; と background-repeat: no-repeat; はCSSで既に設定済み
            }

            return; // これ以上PC向けの計算を実行しない
        }

        // --- 1280px以上の場合にのみ以下のPC向けパララックス効果が適用される ---

        parallaxSmallElements.forEach(element => {
            const speed = 0.2;
            const offset = window.scrollY * speed - 600;
            element.style.transform = `translateY(${offset}px)`;
        });

        parallaxElements.forEach(element => {
            const offset = window.scrollY * 0.1 - 300;
            element.style.transform = `translateY(${offset}px)`;
        });

        let baseOffset = screenWidth <= 768 ? 450 : 550;

        parallaxElements2.forEach(element => {
            if (screenWidth > 767) {
                const offset = window.scrollY * 0.1 - baseOffset;
                element.style.transform = `translateY(${offset}px)`;
            } else {
                element.style.transform = `translateY(0px)`;
            }
        });

        if (parallaxBgImg) {
            const scrollOffset = window.scrollY / 10;
            parallaxBgImg.style.transform = `translateY(${scrollOffset}px) scale(1.0)`;
        }

        // PCの場合、モバイル向け背景のスタイルをリセット (もし設定されていたら)
        if (topNewsAboutSection) {
            topNewsAboutSection.style.backgroundPosition = `center top`; // あるいは `initial`
        }
    };

    const throttledParallax = throttle(applyParallax, 16);

    if (document._parallaxScrollHandler) {
        document.removeEventListener('scroll', document._parallaxScrollHandler);
    }
    document._parallaxScrollHandler = throttledParallax;
    document.addEventListener('scroll', document._parallaxScrollHandler);

    if (window._parallaxResizeHandler) {
        window.removeEventListener('resize', window._parallaxResizeHandler);
    }
    window._parallaxResizeHandler = () => {
        // リサイズ時にすべてのパララックス要素をリセット
        document.querySelectorAll('.parallax-small, .parallax, .parallax-2').forEach(element => {
            element.style.transform = `translateY(0px)`;
        });
        const elemImg = document.getElementById('parallaxBgImg');
        if (elemImg) {
            elemImg.style.transform = `translateY(0px) scale(1.0)`;
        }
        // リサイズ時にモバイル背景の位置もリセット
        const topNewsAboutSection = document.querySelector('.top-news-about');
        if (topNewsAboutSection) {
            topNewsAboutSection.style.backgroundPosition = `center top`;
        }

        applyParallax(); // リサイズ後に再度適用条件をチェック
    };
    window.addEventListener('resize', window._parallaxResizeHandler);

    applyParallax(); // 初期呼び出し
}

// ----------------------------------------------------------------
//     ヘッダードロワーを初期化する関数
// ----------------------------------------------------------------
function initHeaderDrawer(forcedNamespace = null) {
    let currentNamespace;

    if (forcedNamespace) {
        currentNamespace = forcedNamespace;
    } else {
        const barbaContainer = document.querySelector('[data-barba="container"]');
        if (barbaContainer && barbaContainer.dataset.barbaNamespace) {
            currentNamespace = barbaContainer.dataset.barbaNamespace;
        } else {
            currentNamespace = 'default';
        }
    }

    // URLがトップページでnamespaceがhomeでない場合、強制的にhomeにするロジック
    if (currentNamespace !== 'home' && (window.location.pathname === '/' || window.location.pathname === '/home/')) {
        console.log('initHeaderDrawer: Force setting namespace to home based on URL.');
        currentNamespace = 'home';
    }
    const isTopPage = currentNamespace === 'home';

    console.log('initHeaderDrawer: isTopPage is:', isTopPage);
    console.log('initHeaderDrawer: Barba Namespace is:', currentNamespace);

    const homeDrawer = document.querySelector('.home-drawer'); // ハンバーガーアイコンのラッパー
    const drawerNav = document.querySelector('.home-drawer-nav'); // ドロワーメニュー本体
    const bar1 = homeDrawer?.querySelector('.drawer-iconBar1');
    const bar2 = homeDrawer?.querySelector('.drawer-iconBar2');
    const headerNav = document.querySelector('.header-nav'); // .header-nav を取得
    const headerNavLinks = headerNav ? headerNav.querySelectorAll('.header-nav-item a') : []; // .header-nav-item 内のすべての <a> 要素を取得

    if (!homeDrawer || !drawerNav || !bar1 || !bar2 || !headerNav) {
        console.warn('initHeaderDrawer: Required elements (homeDrawer, drawerNav, bar1, bar2, headerNav) not found.');
        return;
    }

    // --- ここからアクティブリンク設定ロジックを修正 ---
    // 1. まず、すべてのナビゲーションリンクから「active」クラスを確実に削除する
    headerNavLinks.forEach(link => {
        link.classList.remove('active');
    });
    console.log('initHeaderDrawer: All nav links "active" class reset.');

    // 2. 現在のパスと名前空間に基づいて、アクティブなリンクを設定する
    const currentPath = window.location.pathname;

    headerNavLinks.forEach(link => {
        // リンクの href からパス部分のみを取得し、末尾のスラッシュを削除して比較しやすくする
        // 例: "http://teraokanatsumicom.local/events/" -> "/events"
        const linkHrefPath = new URL(link.href).pathname.replace(/\/$/, '');
        // 現在のURLパスも同様に末尾のスラッシュを削除
        const currentPathClean = currentPath.replace(/\/$/, '');

        let shouldBeActive = false;

        // 【優先度の高い、厳密なマッチング】
        // Home ページ: namespace が 'home' で、リンクパスがルート ('/') または '/home' の場合
        if (currentNamespace === 'home' && (linkHrefPath === '' || linkHrefPath === '/home')) {
            shouldBeActive = true;
            console.log(`initHeaderDrawer: Matched Home link: ${linkHrefPath}`);
        }
        // About ページ: namespace が 'page' で、リンクパスと現在のパスが完全に '/about' で一致する場合
        else if (currentNamespace === 'page' && linkHrefPath === '/about' && currentPathClean === '/about') {
             shouldBeActive = true;
             console.log(`initHeaderDrawer: Matched About link: ${linkHrefPath}`);
        }
        // Contact ページ群: namespace が 'contact', 'contact-confirm', 'thanks' のいずれかで、
        // リンクパスが '/contact' で始まる場合
        else if (linkHrefPath.startsWith('/contact') && ['contact', 'contact-confirm', 'thanks'].includes(currentNamespace)) {
            shouldBeActive = true;
            console.log(`initHeaderDrawer: Matched Contact link: ${linkHrefPath}`);
        }
        // Works, Goods, Events, News のアーカイブ/シングルページ:
        // 各リンクパスが対象の投稿タイプ名で始まり、かつ現在の名前空間がその投稿タイプに関連する場合
        else if (linkHrefPath.startsWith('/works') && (currentNamespace === 'works-archive' || currentNamespace === 'works-single')) {
            shouldBeActive = true;
            console.log(`initHeaderDrawer: Matched Works link: ${linkHrefPath}`);
        }
        else if (linkHrefPath.startsWith('/goods') && (currentNamespace === 'goods-archive' || currentNamespace === 'goods-single')) {
            shouldBeActive = true;
            console.log(`initHeaderDrawer: Matched Goods link: ${linkHrefPath}`);
        }
        else if (linkHrefPath.startsWith('/events') && (currentNamespace === 'events-archive' || currentNamespace === 'events-single')) {
            shouldBeActive = true;
            console.log(`initHeaderDrawer: Matched Events link: ${linkHrefPath}`);
        }
        else if (linkHrefPath.startsWith('/news') && (currentNamespace === 'news-page' || currentNamespace === 'news-single')) {
            shouldBeActive = true;
            console.log(`initHeaderDrawer: Matched News link: ${linkHrefPath}`);
        }
        // 【その他の汎用的な親パス判定】
        // 上記の特定ロジックでカバーされない「/parent/child/」のようなケースで、
        // 親の '/parent/' リンクをアクティブにしたい場合。
        // ただし、Home ('') や、特定のルートページ ('/about', '/contact'など) は
        // 上記の専用ルールで既に処理されていることを前提とし、競合を避けるために除外します。
        // また、リンクパスが空文字列でない（＝Homeでない）かつ、現在のパスがそのリンクパスで始まる場合。
        else if (linkHrefPath !== '' && currentPathClean.startsWith(linkHrefPath) && linkHrefPath.length > 1) {
            shouldBeActive = true;
            console.log(`initHeaderDrawer: Fallback active: ${linkHrefPath} as parent of ${currentPathClean}`);
        }

        if (shouldBeActive) {
            link.classList.add('active'); // `active` クラスを付与
            console.log(`initHeaderDrawer: Active class added to: ${linkHrefPath} for namespace: ${currentNamespace}`);
        }
    });
    // --- ここまでアクティブリンク設定ロジックを修正 ---


    const toggleDrawer = (isOpen) => {
        drawerNav.classList.toggle('is-active', isOpen);
        bar1.classList.toggle('is-active', isOpen);
        bar2.classList.toggle('is-active', isOpen);
        console.log('toggleDrawer called with isOpen:', isOpen, 'drawerNav.classList:', drawerNav.classList.contains('is-active'));
    };

    // ハンバーガーメニューアイコンのクリックイベントリスナー (重複登録防止)
    if (homeDrawer._toggleClickHandler) {
        homeDrawer.removeEventListener('click', homeDrawer._toggleClickHandler);
    }
    homeDrawer._toggleClickHandler = function (e) {
        toggleDrawer(!drawerNav.classList.contains('is-active'));
    };
    homeDrawer.addEventListener('click', homeDrawer._toggleClickHandler);

    // ドロワー外クリックで閉じるイベントリスナー (重複登録防止)
    if (document._outsideClickHandler) {
        document.removeEventListener('click', document._outsideClickHandler);
    }

    console.log('initHeaderDrawer: Outside click handler IS REGISTERED (All pages).');
    document._outsideClickHandler = function (e) {
        const isActive = drawerNav.classList.contains('is-active');
        const isHomeDrawerClick = homeDrawer.contains(e.target);
        const isDrawerNavClick = drawerNav.contains(e.target);

        const isMobile = window.innerWidth < 1280;
        const isSubpagePC = !isTopPage && !isMobile; // PCの下層ページ

        if (isActive && !isHomeDrawerClick && !isDrawerNavClick && !isSubpagePC) {
            toggleDrawer(false);
        }
    };
    document.addEventListener('click', document._outsideClickHandler);

    // ドロワー内のリンクをクリックで閉じる処理 (重複登録防止)
    drawerNav.querySelectorAll('a').forEach(link => {
        if (link._clickHandler) {
            link.removeEventListener('click', link._clickHandler);
        }
        link._clickHandler = function() {
            const isMobile = window.innerWidth < 1280;
            const isSubpagePC = !isTopPage && !isMobile;

            if (drawerNav.classList.contains('is-active') && !isSubpagePC) {
                toggleDrawer(false);
            }
        };
        link.addEventListener('click', link._clickHandler);
    });

    const fixedContent = document.querySelector(".fixed-content");
    const hiddenArea = document.querySelector("footer");

    if (fixedContent && hiddenArea) {
        // IntersectionObserver の重複登録防止
        if (hiddenArea._intersectionObserver) {
            hiddenArea._intersectionObserver.disconnect();
            hiddenArea._intersectionObserver = null;
        }

        const handleVisibility = () => {
            const isMobileCurrent = window.innerWidth < 1280;

            console.log('handleVisibility: isTopPage is:', isTopPage, 'isMobileCurrent is:', isMobileCurrent);
            console.log('handleVisibility: currentNamespace is:', currentNamespace);

            homeDrawer.style.removeProperty('display'); // まずリセット

            if (!isTopPage && !isMobileCurrent) { // 下層ページ（PC）の場合
                console.log('handleVisibility: Subpage (PC) detected. Hiding homeDrawer.');
                drawerNav.classList.add('is-active'); // メニューを常に開いた状態
                homeDrawer.style.setProperty('display', 'none', 'important'); // ハンバーガーアイコンを非表示
                bar1.classList.remove('is-active'); // バーアイコンの状態もリセット
                bar2.classList.remove('is-active');
            } else { // トップページ（PC）の場合 OR モバイル（トップ/下層共通）の場合
                console.log('handleVisibility: Top page (PC) or Mobile detected. Showing homeDrawer.');
                drawerNav.classList.remove('is-active'); // メニューを閉じた状態
                homeDrawer.style.removeProperty('display'); // ハンバーガーアイコンは表示
                bar1.classList.remove('is-active'); // バーアイコンの状態もリセット
                bar2.classList.remove('is-active');
            }
            console.log('handleVisibility: Final homeDrawer style (after handleVisibility):', homeDrawer.style.display);
            console.log('handleVisibility: Final drawerNav classes (after handleVisibility):', drawerNav.classList);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        fixedContent.classList.add("is-hidden");
                    } else {
                        fixedContent.classList.remove("is-hidden");
                    }
                });
            },
            { root: null, threshold: 0 }
        );
        observer.observe(hiddenArea);
        hiddenArea._intersectionObserver = observer;

        // リサイズイベントリスナーの重複登録防止
        if (window._drawerResizeHandler) {
            window.removeEventListener('resize', window._drawerResizeHandler);
        }
        window._drawerResizeHandler = handleVisibility;
        window.addEventListener('resize', window._drawerResizeHandler);

        handleVisibility(); // 初期実行
    } else {
        console.warn('initHeaderDrawer: fixedContent or hiddenArea not found for observer.');
    }
}

// ----------------------------------------------------------------
//  スクロールダウンでメインビジュアルをブラー
// ----------------------------------------------------------------
function initMvBlurOnScroll() {
    const applyMvBlur = () => {
        const mvImage = document.querySelector('#hero img.pc-only');
        const spImage = document.querySelector('#hero img.sp-only');
        const scrollY = window.scrollY;
        const maxBlur = 8;
        const maxScroll = 300;
        const blurValue = Math.min(scrollY / maxScroll * maxBlur, maxBlur);

        if (mvImage) mvImage.style.filter = `blur(${blurValue}px)`;
        if (spImage) spImage.style.filter = `blur(${blurValue}px)`;
    };

    if (document._mvBlurScrollHandler) {
        document.removeEventListener('scroll', document._mvBlurScrollHandler);
    }
    document._mvBlurScrollHandler = applyMvBlur;
    document.addEventListener('scroll', document._mvBlurScrollHandler);
    applyMvBlur(); // 初期呼び出し
}

// ----------------------------------------------------------------
//  スクロールでトップページeventを徐々に消す
// ----------------------------------------------------------------
function initEventFadeOnScroll() {
    const applyEventFade = () => {
        const eventBox = document.getElementById('event-info');
        if (!eventBox) return;

        const scrollY = window.scrollY;
        const fadeStart = 100;
        const fadeEnd = 600;
        const opacity = scrollY > fadeStart ? Math.max(1 - (scrollY - fadeStart) / (fadeEnd - fadeStart), 0) : 1;

        eventBox.style.opacity = opacity;
    };

    if (document._eventFadeScrollHandler) {
        document.removeEventListener('scroll', document._eventFadeScrollHandler);
    }
    document._eventFadeScrollHandler = applyEventFade;
    document.addEventListener('scroll', document._eventFadeScrollHandler);
    applyEventFade(); // 初期呼び出し
}

// ----------------------------------------------------------------
//  Contact Form 7を正常動作させるための関数 (Turnstile対応版)
// ----------------------------------------------------------------
function contactForm7Run(next) {
    console.log('contactForm7Run: 関数が呼び出されました。');
    var cfSelector = 'div.wpcf7 > form';
    var cfForms = next.container.querySelectorAll(cfSelector);

    if (cfForms.length) {
        console.log('contactForm7Run: ' + cfForms.length + ' 個の Contact Form 7 フォームが見つかりました。');
        cfForms.forEach(function(formElement) {
            var $form = jQuery(formElement);

            // Contact Form 7の初期化
            if (typeof wpcf7 !== 'undefined' && typeof wpcf7.init === 'function') {
                wpcf7.init(formElement);
                console.log('contactForm7Run: Contact Form 7 フォームを再初期化しました:', formElement);

                // Conditional Fields for CF7 の初期化
                if (typeof wpcf7cf !== 'undefined' && typeof wpcf7cf.initForm === 'function') {
                    wpcf7cf.initForm($form);
                    console.log('contactForm7Run: Conditional Fields for CF7 を初期化しました:', formElement);
                } else {
                    console.warn('contactForm7Run: wpcf7cf.initForm 関数が見つかりません。');
                }
            } else {
                console.warn('contactForm7Run: wpcf7.init 関数が見つかりません。');
            }

            // ★★★ 修正: Turnstile の再初期化ロジック ★★★
            const turnstileContainer = formElement.querySelector('.cf-turnstile');
            if (turnstileContainer) {
                console.log('contactForm7Run: Turnstile コンテナが見つかりました:', turnstileContainer);

                // 既存のウィジェットをクリア（もし存在する場合）
                if (turnstileContainer.dataset.widgetId) {
                    try {
                        if (typeof turnstile !== 'undefined' && turnstile.remove) {
                            turnstile.remove(turnstileContainer.dataset.widgetId);
                            console.log('contactForm7Run: 既存のTurnstileウィジェットを削除しました');
                        }
                    } catch (error) {
                        console.warn('contactForm7Run: Turnstileウィジェットの削除中にエラー:', error);
                    }
                }

                // コンテナの中身をクリア
                turnstileContainer.innerHTML = '';

                // Turnstile の初期化関数を定義
                const initializeTurnstile = () => {
                    if (typeof turnstile !== 'undefined' && turnstile.render) {
                        try {
                            // サイトキーを data-sitekey 属性から取得、または直接指定
                            const sitekey = turnstileContainer.dataset.sitekey || '0x4AAAAAAB1-c2zMqutSsHd6';

                            const widgetId = turnstile.render(turnstileContainer, {
                                sitekey: sitekey,
                                callback: function(token) {
                                    console.log('Turnstile: トークンが取得されました');
                                    // 必要に応じてトークンを隠しフィールドに設定
                                    const hiddenInput = formElement.querySelector('input[name="cf-turnstile-response"]');
                                    if (hiddenInput) {
                                        hiddenInput.value = token;
                                    }
                                },
                                'error-callback': function() {
                                    console.error('Turnstile: エラーが発生しました');
                                },
                                'expired-callback': function() {
                                    console.warn('Turnstile: トークンが期限切れになりました');
                                }
                            });

                            // widgetId を保存（後で削除するため）
                            turnstileContainer.dataset.widgetId = widgetId;
                            console.log('contactForm7Run: Turnstile ウィジェットを再レンダリングしました:', widgetId);

                        } catch (error) {
                            console.error('contactForm7Run: Turnstile レンダリング中にエラー:', error);
                        }
                    } else {
                        console.warn('contactForm7Run: Turnstile API が利用できません。スクリプトの読み込みを確認してください。');
                    }
                };

                // Turnstile APIが利用可能かチェックして初期化
                if (typeof turnstile !== 'undefined') {
                    initializeTurnstile();
                } else {
                    // Turnstile スクリプトがまだ読み込まれていない場合、少し待って再試行
                    console.log('contactForm7Run: Turnstile API を待機中...');
                    let attempts = 0;
                    const maxAttempts = 10;
                    const checkTurnstile = () => {
                        attempts++;
                        if (typeof turnstile !== 'undefined') {
                            initializeTurnstile();
                        } else if (attempts < maxAttempts) {
                            setTimeout(checkTurnstile, 100);
                        } else {
                            console.error('contactForm7Run: Turnstile API の読み込みがタイムアウトしました');
                        }
                    };
                    checkTurnstile();
                }
            } else {
                console.log('contactForm7Run: このフォームにはTurnstileコンテナがありません');
            }
            // ★★★ ここまで修正 ★★★
        });
    } else {
        console.log('contactForm7Run: Contact Form 7 フォームが next.container 内に見つかりませんでした。');
    }
}

// ----------------------------------------------------------------
// 追加：ページ離脱時にTurnstileウィジェットをクリーンアップする関数
// ----------------------------------------------------------------
function cleanupTurnstileWidgets() {
    if (typeof turnstile !== 'undefined' && turnstile.remove) {
        const turnstileContainers = document.querySelectorAll('.cf-turnstile[data-widget-id]');
        turnstileContainers.forEach(container => {
            const widgetId = container.dataset.widgetId;
            if (widgetId) {
                try {
                    turnstile.remove(widgetId);
                    console.log('cleanupTurnstileWidgets: ウィジェットをクリーンアップしました:', widgetId);
                } catch (error) {
                    console.warn('cleanupTurnstileWidgets: クリーンアップ中にエラー:', error);
                }
            }
        });
    }
}

// ----------------------------------------------------------------
// フッターナビゲーションリンクのイベントリスナー設定関数 (ここが良い位置です)
// ----------------------------------------------------------------
function setupFooterNavLinks() {
    console.log('setupFooterNavLinks 関数が呼び出されました。');

    // .footer クラス内の nav-item クラスを持つ要素内のリンクを取得 (menu-items.php で生成されるリンク)
    const footerNavLinks = document.querySelectorAll('footer .nav-item a');
    footerNavLinks.forEach(link => {
        // 既にイベントリスナーが追加されていないかチェックするためのデータ属性
        if (!link.dataset.barbaCustomListener) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Barbajs で処理すべき内部リンクかを判定
                // target="_blank", #アンカー, mailto:, tel:, download, 外部URLは除外
                if (
                    href &&
                    !href.startsWith('#') &&
                    !href.startsWith('mailto:') &&
                    !href.startsWith('tel:') &&
                    this.target !== '_blank' &&
                    !this.hasAttribute('download') &&
                    href.includes(window.location.origin) // 同じドメイン内のリンクのみ
                ) {
                    e.preventDefault(); // デフォルトの遷移を阻止
                    console.log('フッターナビリンクのクリックを Barbajs で処理:', href);
                    try {
                        barba.go(href).then(() => {
                            console.log('Barbajs 遷移が正常に開始されました:', href);
                        }).catch(error => {
                            console.error('Barbajs 遷移の開始中にエラーが発生しました:', error);
                            // エラーが発生した場合でも、念のためフルリロードに戻す
                            window.location.href = href;
                        });
                    } catch (err) {
                        console.error('barba.go() の呼び出し自体でエラーが発生しました:', err);
                        // ここに到達した場合は、barbaオブジェクトが未定義か、致命的な初期化問題がある
                        window.location.href = href; // フルリロードにフォールバック
                    }
                } else {
                    console.log('フッターナビリンクを通常処理 (Barba.js対象外):', href);
                }
            });
            link.dataset.barbaCustomListener = 'true'; // カスタムリスナーを追加したマーク
        }
    });

    // フッターの「お問い合わせ」ボタン (.footer-contact a)
    const footerContactLink = document.querySelector('footer .footer-contact a');
    if (footerContactLink && !footerContactLink.dataset.barbaCustomListener) {
        footerContactLink.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (
                href &&
                !href.startsWith('#') &&
                !href.startsWith('mailto:') &&
                !href.startsWith('tel:') &&
                this.target !== '_blank' &&
                !this.hasAttribute('download') &&
                href.includes(window.location.origin)
            ) {
                e.preventDefault();
                console.log('フッターお問い合わせリンクのクリックを Barbajs で処理:', href);
                try {
                    barba.go(href);
                } catch (err) {
                    console.error('barba.go() の呼び出し自体でエラーが発生しました:', err);
                    window.location.href = href;
                }
            } else {
                console.log('フッターお問い合わせリンクを通常処理 (Barba.js対象外):', href);
            }
        });
        footerContactLink.dataset.barbaCustomListener = 'true';
    }

    // プライバシーポリシーリンク (.footer-privacy-policy a)
    const privacyPolicyLink = document.querySelector('footer .footer-privacy-policy a');
    if (privacyPolicyLink && !privacyPolicyLink.dataset.barbaCustomListener) {
        privacyPolicyLink.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (
                href &&
                !href.startsWith('#') &&
                !href.startsWith('mailto:') &&
                !href.startsWith('tel:') &&
                this.target !== '_blank' &&
                !this.hasAttribute('download') &&
                href.includes(window.location.origin)
            ) {
                e.preventDefault();
                console.log('プライバシーポリシーリンクのクリックを Barbajs で処理:', href);
                try {
                    barba.go(href);
                } catch (err) {
                    console.error('barba.go() の呼び出し自体でエラーが発生しました:', err);
                    window.location.href = href;
                }
            } else {
                console.log('プライバシーポリシーリンクを通常処理 (Barba.js対象外):', href);
            }
        });
        privacyPolicyLink.dataset.barbaCustomListener = 'true';
    }
}

// ----------------------------------------------------------------
//     すべてのスクリプトを再初期化する関数
// ----------------------------------------------------------------
function initAllScripts() {
    console.log('--- initAllScripts が実行されました！ ---');
    setupBarbaAnimationControl();
    initModal();
    initSwipers();
    initAccordion();
    initPriceFormatter();
    initTopPageGoodsAnimation();
    initParallax();
    // initHeaderNavActive();
    initMvBlurOnScroll();
    initEventFadeOnScroll();
    // initFilterScripts と initEventFilter は個別にBarba.jsのafterフックで制御するため、ここには含めない
    // ただし、Barba.jsを使わないフォールバックの場合はここに追加することも検討する
    // window.scrollTo(0, 0);
}

// ----------------------------------------------------------------
// Barba.js 初期化 (関数定義)
// ----------------------------------------------------------------
let barbaInitialized = false;
function setupBarba() {
    if (barbaInitialized) {
        console.warn('Barba.js は既に初期化されています。');
        return;
    }

    console.log('setupBarba 関数が呼び出されました！');

    // Barba.js 初期化時に一度だけヘッダードロワーとフィルタースクリプトを初期化するために、
    // 最初の名前空間をここで取得します。
    const initialBarbaContainerForSetup = document.querySelector('[data-barba="container"]');
    const initialNamespaceForSetup = initialBarbaContainerForSetup?.dataset.barbaNamespace || 'default';
    console.log('setupBarba: initialNamespaceForSetup を次のように決定しました:', initialNamespaceForSetup);

    // Barba.js のデバッグモードを有効化
    barba.use({ debug: true });

    barba.init({
        views: [
            { namespace: 'home' },
            { namespace: 'works-archive' },
            { namespace: 'works-single' },
            { namespace: 'goods-archive' },
            { namespace: 'goods-single' },
            { namespace: 'events-archive' },
            { namespace: 'events-single' },
            { namespace: 'news-page' },
            { namespace: 'news-single' },

            {
                namespace: 'contact', // contact.php に対応
                beforeEnter() { console.log('Entering contact page view.'); }
            },
            {
                namespace: 'contact-confirm', // contact-confirm.php に対応
                beforeEnter() { console.log('Entering contact-confirm page view.'); }
            },
            {
                namespace: 'thanks', // thanks.php に対応
                beforeEnter() { console.log('Entering thanks page view.'); }
            },
            { namespace: 'page' } // その他の一般的な固定ページ
        ],
        transitions: [{
            name: 'default-transition',

            // ページを離れる直前の処理
            beforeLeave({ current }) {
                console.log('--- Barba transition beforeLeave hoge ---');
                // ドロワーメニューを閉じる処理だけを残す
                const prevDrawerNav = current.container.querySelector('.home-drawer-nav');
                if (prevDrawerNav) {
                    prevDrawerNav.classList.remove('is-active');
                }

                // ★ 追加：Turnstileウィジェットのクリーンアップ
                cleanupTurnstileWidgets();
            },

            // ページが消えるアニメーション
            leave({ current }) {
                return new Promise(resolve => {
                    current.container.style.transition = 'opacity 0.1s ease-out';
                    current.container.style.opacity = '0';

                    const onTransitionEnd = () => {
                        current.container.removeEventListener('transitionend', onTransitionEnd);
                        resolve();
                    };
                    current.container.addEventListener('transitionend', onTransitionEnd);
                    setTimeout(() => { // 念のためのフォールバック
                        current.container.removeEventListener('transitionend', onTransitionEnd);
                        resolve();
                    }, 150);
                });
            },

            // 新しいページが現れるアニメーション
            enter({ next }) {
                return new Promise(resolve => {
                    const container = next.container;
                    container.style.transition = 'opacity 0.1s ease-in';
                    container.style.opacity = '0';

                    requestAnimationFrame(() => {
                        container.style.opacity = '1';
                    });

                    const onTransitionEnd = () => {
                        container.removeEventListener('transitionend', onTransitionEnd);
                        resolve();
                    };
                    container.addEventListener('transitionend', onTransitionEnd);
                    setTimeout(() => { // 念のためのフォールバック
                        container.removeEventListener('transitionend', onTransitionEnd);
                        resolve();
                    }, 150);
                });
            },

            after(data) {
                console.log('--- Barba transition after フックが実行されました！ ---');
                const newNamespace = data.next.namespace;
                console.log('次のページのnamespace:', newNamespace);

                try {

                    initAllScripts();
                    console.log('Barba after hook: initAllScripts が呼び出されました。');

                    // フィルターページでのみinitFilterScriptsを実行
                    if (newNamespace === 'events-archive') {
                        if (typeof initEventsFilter === 'function') initEventsFilter();
                    } else if (['works-archive', 'goods-archive'].includes(newNamespace)) {
                        if (typeof initWorksGoodsFilter === 'function') initWorksGoodsFilter(newNamespace);
                    }

                    // これが Barbajs 遷移後の唯一の initHeaderDrawer 呼び出しになります。
                    if (typeof initHeaderDrawer === 'function') {
                        initHeaderDrawer(newNamespace);
                        console.log('Barba after hook: initHeaderDrawer called with namespace:', newNamespace);
                    } else {
                        console.warn('initHeaderDrawer 関数が定義されていません。');
                    }


                    // contactForm7Run の呼び出し条件をより正確に
                    if (newNamespace === 'contact' || newNamespace === 'contact-confirm' || newNamespace === 'thanks') {
                        console.log(`Barba after hook: Calling contactForm7Run for ${newNamespace} page.`);
                        if (typeof contactForm7Run === 'function') {
                            contactForm7Run(data.next);
                        }
                    } else if (newNamespace === 'page') {
                        const hasWpcf7Form = data.next.container.querySelector('div.wpcf7 > form');
                        if (hasWpcf7Form) {
                            console.log('Barba after hook: Calling contactForm7Run for generic page with CF7 form.');
                            if (typeof contactForm7Run === 'function') {
                                contactForm7Run(data.next);
                            }
                        }
                    }

                    // .footer-contact の表示制御
                    const footerContact = data.next.container.querySelector('.footer-contact');
                    if (footerContact) {
                        if (newNamespace === 'contact' || newNamespace === 'contact-confirm' || newNamespace === 'thanks') {
                            footerContact.style.display = 'none';
                            console.log(`Barba after hook: .footer-contact を非表示にしました (${newNamespace}ページ).`);
                        } else {
                            footerContact.style.removeProperty('display');
                            console.log(`Barba after hook: .footer-contact の表示をリセットしました (${newNamespace}ページ).`);
                        }
                    }

                    // Body data-page attribute update
                    document.body.setAttribute('data-page', newNamespace);
                    console.log('Body data-page attribute updated to:', newNamespace);

                    // Top page video autoplay
                    if (newNamespace === 'home') {
                        const videoSection = document.querySelector('.js-autoplay-video-section'); // js-autoplay-video-video-section ではなく js-autoplay-video-section が正しい場合
                        if (videoSection) {
                            const videoElement = videoSection.querySelector('video');
                            if (videoElement) {
                                videoElement.play().then(() => {
                                    console.log('Video started playing on home page.');
                                }).catch(error => {
                                    console.warn('Video play() failed:', error);
                                });
                            }
                        }
                    }

                    window.scrollTo(0, 0);
                    console.log('Barba after hook: window.scrollTo(0, 0) executed.');

                } catch (error) {
                    console.error('Barba.js after hook でエラーが発生しました:', error);
                    throw error;
                }
            },
        }],
        // hooks: {
        //         before: (data) => {
        //             console.log('--- Barba global before フックが実行されました！ ---');
        //             const link = data.trigger;
        //             if (link && link.tagName === 'A' && link.closest('footer')) {
        //                 console.log('Barba.js: フッターナビのリンクをインターセプトしました:', link.href);
        //             } else {
        //                 console.log('Barba.js: 通常のリンクをインターセプトしました:', link ? link.href : '不明');
        //             }
        //         },
        //         after: ({ next }) => {
        //             console.log('--- Barba global after フックが実行されました！ ---');
        //             if (typeof document.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        //                 document.dispatchEvent(new CustomEvent('wpcf7.dom_updated'));
        //                 console.log('wpcf7.dom_updated イベントがディスパッチされました。');
        //             } else {
        //                 console.warn('CustomEvent または document.dispatchEvent がサポートされていません。wpcf7.dom_updated は発火できません。');
        //             }

        //             setupFooterNavLinks();

        //             if (typeof gtag === 'function') {
        //                 const path = window.location.pathname;
        //                 gtag('config', 'G-P6LZH4KCDP', {
        //                     'page_path': path,
        //                 });
        //                 console.log(`GA4: New page view tracked for path: ${path}`);
        //             }
        //         }
        //     },
        prevent: ({ el }) => {
            // WordPress 管理バーのリンクを Barbajs の対象外にする
            // これらのリンクは Barbajs による SPA 遷移ではなく、通常のページロードが必要です
            if (el && el.closest('#wpadminbar')) {
                console.log('Barba.js: #wpadminbar 内のリンクなので遷移を防止します。', el.href);
                return true; // true を返すことで Barbajs による遷移を防止
            }

            // data-no-barba 属性を持つリンクも対象外にする (もしカスタムで使っている場合)
            if (el && el.dataset.noBarba) {
                console.log('Barba.js: data-no-barba 属性を持つリンクなので遷移を防止します。', el.href);
                return true;
            }

            // 上記以外は通常通り Barbajs で遷移を許可 (falseを返すか、何も返さない)
            return false;
        },
    });

    // ----------------------------------------------------------------
    // ▼ グローバルなフックをBarba.jsの初期化後に定義
    // ----------------------------------------------------------------
    barba.hooks.before((data) => {
        console.log('--- Barba global before フックが実行されました！ ---');
        const link = data.trigger;
        if (link && link.tagName === 'A' && link.closest('footer')) {
            console.log('Barba.js: フッターナビのリンクをインターセプトしました:', link.href);
        } else {
            console.log('Barba.js: 通常のリンクをインターセプトしました:', link ? link.href : '不明');
        }
    });

    barba.hooks.after((data) => {
        console.log('--- Barba global after フックが実行されました！ ---');
        // ... 既存のコードをここに移動 ...
        if (typeof document.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
            document.dispatchEvent(new CustomEvent('wpcf7.dom_updated'));
            console.log('wpcf7.dom_updated イベントがディスパッチされました。');
        } else {
            console.warn('CustomEvent または document.dispatchEvent がサポートされていません。wpcf7.dom_updated は発火できません。');
        }
        setupFooterNavLinks();

        // GA4トラッキング
        if (typeof gtag === 'function') {
            const path = window.location.pathname;
            gtag('config', 'G-P6LZH4KCDP', {
                'page_path': path,
            });
            console.log(`GA4: New page view tracked for path: ${path}`);
        }
    });

    initHeaderDrawer(initialNamespaceForSetup);

    // console.log('barba.init の呼び出しが完了しました！');
    barbaInitialized = true;
    console.log('Barba.js が初期化されました。');
}

// ----------------------------------------------------------------
//     DOMContentLoaded で一度だけ実行する処理
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: ページが完全にロードされました。');

    // Barbajs の初期状態ログ (デバッグ用なので残しておいてもOK)
    console.log('DOMContentLoaded: barbaオブジェクトの初期状態:', typeof barba, barba);
    if (typeof barba === 'object' && barba !== null) {
        console.log('DOMContentLoaded: barba.go メソッドの存在:', typeof barba.go);
        console.log('DOMContentLoaded: barba.init メソッドの存在:', typeof barba.init);
    }

    setupBarba(); // Barba.js の初期化

    initAllScripts();

    // 初回ロード時に filter.js の initFilterScripts を呼び出す
    // Barba.js はまだ transition を実行していないため、data-barba-namespace を直接取得
    const initialNamespace = document.querySelector('[data-barba="container"]')?.dataset.barbaNamespace;

    if (initialNamespace === 'events-archive') {
        if (typeof initEventsFilter === 'function') initEventsFilter();
    } else if (['works-archive', 'goods-archive'].includes(initialNamespace)) {
        if (typeof initWorksGoodsFilter === 'function') initWorksGoodsFilter(initialNamespace);
    } else {
        console.warn('DOMContentLoaded: initFilterScripts 関数が定義されていないか、初期namespaceが取得できませんでした。');
    }

    // Escapeキーでモーダルを閉じる処理 (documentレベルで一度だけ設定)
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal:not(.hidden)');
            if (openModals.length > 0) {
                openModals.forEach(modal => modal.classList.add('hidden'));
            }
        }
    });

    // ローディングアニメーション (一度しか実行されないため DOMContentLoaded の中に残す)
    const whiteScreen = document.querySelector('#loader-white');
    const heroSection = document.querySelector('#hero');
    const curtainInner = document.querySelector('#curtain-inner');
    const logoElement = document.querySelector('.fade-in-out-custom');

    if (whiteScreen && heroSection && curtainInner && logoElement) {
        logoElement.addEventListener('animationend', () => {
            curtainInner.classList.remove('translate-y-full');
            curtainInner.classList.add('animate-curtainReveal');
            logoElement.style.display = 'none';
        });

        curtainInner.addEventListener('animationend', () => {
            whiteScreen.style.animationPlayState = 'running';
        });

        whiteScreen.addEventListener('animationend', () => {
            whiteScreen.style.display = 'none';
            heroSection.classList.remove('opacity-0');
            heroSection.classList.add('opacity-100');
            document.body.classList.remove('no-scroll');
        });
    }
});
