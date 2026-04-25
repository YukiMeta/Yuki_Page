// assets/js/filter.js (最終版)

console.log('filter.js (Ajax version) ファイルが読み込まれました！');

/**
 * Works と Goods 一覧ページ用のフィルター初期化関数
 */
function initWorksGoodsFilter(namespace) {
    console.log(`Works/Goods filter initializing for: ${namespace}`);
    const currentContainer = document.querySelector(`[data-barba-namespace="${namespace}"]`);
    if (!currentContainer) return;

    const postsContainer = currentContainer.querySelector('#filtered-posts-container');
    const paginationContainer = currentContainer.querySelector('#pagination-container');
    const filterButtonsContainer = currentContainer.querySelector('.tag-list');
    const postType = namespace.replace('-archive', '');

    const attachListeners = () => {
        // タグボタンのリスナー
        filterButtonsContainer?.querySelectorAll('.tag-link').forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();
                const tag = e.currentTarget.dataset.tag;
                filterButtonsContainer.querySelectorAll('.tag-link').forEach(btn => btn.classList.remove('is-active'));
                e.currentTarget.classList.add('is-active');
                fetchPosts(tag, 1);
            });
        });
        // ページネーションのリスナー
        paginationContainer?.addEventListener('click', e => {
            const link = e.target.closest('a.page-numbers');
            if (!link) return;
            e.preventDefault();
            const url = new URL(link.href);
            const paged = url.searchParams.get('paged') || 1;
            const tag = filterButtonsContainer?.querySelector('.is-active')?.dataset.tag || 'all';
            fetchPosts(tag, paged);
        });
    };

    const fetchPosts = async (tag = 'all', paged = 1) => {
        if (!postsContainer) return;
        postsContainer.style.opacity = '0.5';
        const taxonomy = (postType === 'works') ? 'works_category' : 'goods_category';

        const formData = new FormData();
        formData.append('action', 'filter_posts_by_custom_type_and_taxonomy');
        formData.append('post_type', postType);
        formData.append('taxonomy', taxonomy);
        formData.append('tag', tag);
        formData.append('paged', paged);

        try {
            const response = await fetch(ajax_object.ajax_url, { method: 'POST', body: formData });
            const json = await response.json();
            if (json.success) {
                postsContainer.innerHTML = json.data.posts_html;
                if (paginationContainer) paginationContainer.innerHTML = json.data.pagination_html;
                attachListeners();
            }
        } catch (error) {
            console.error('Filtering error:', error);
        } finally {
            postsContainer.style.opacity = '1';
        }
    };

    // Works/Goodsでは、初期表示はPHPが行うため、リスナーの設定のみ行う
    attachListeners();
}


/**
 * Events 一覧ページ専用のフィルター初期化関数
 */
function initEventsFilter() {
    console.log('Events filter initializing...');
    const currentContainer = document.querySelector('[data-barba-namespace="events-archive"]');
    if (!currentContainer) return;

    const postsContainer = currentContainer.querySelector('#filtered-posts-container');
    const paginationContainer = currentContainer.querySelector('#pagination-container');
    const filterButtonsContainer = currentContainer.querySelector('.tag-list');
    const monthSelect = currentContainer.querySelector('#month-filter');

    const attachListeners = () => {
        // タグボタンのリスナー
        filterButtonsContainer?.querySelectorAll('.tag-link').forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();
                const tag = e.currentTarget.dataset.tag;
                filterButtonsContainer.querySelectorAll('.tag-link').forEach(btn => btn.classList.remove('is-active'));
                e.currentTarget.classList.add('is-active');
                fetchPosts(tag, monthSelect.value, 1);
            });
        });
        // 月セレクトのリスナー
        monthSelect?.addEventListener('change', e => {
            const month = e.currentTarget.value;
            const tag = filterButtonsContainer?.querySelector('.is-active')?.dataset.tag || 'all';
            fetchPosts(tag, month, 1);
        });
        // ページネーションのリスナー
        paginationContainer?.addEventListener('click', e => {
            const link = e.target.closest('a.page-numbers');
            if (!link) return;
            e.preventDefault();
            const url = new URL(link.href);
            const paged = url.searchParams.get('paged') || 1;
            const tag = filterButtonsContainer?.querySelector('.is-active')?.dataset.tag || 'all';
            fetchPosts(tag, monthSelect.value, paged);
        });
    };

    const fetchPosts = async (tag = 'all', month = 'all', paged = 1) => {
        if (!postsContainer) return;
        postsContainer.style.opacity = '0.5';

        const formData = new FormData();
        formData.append('action', 'filter_events_by_month_and_tag');
        formData.append('tag', tag);
        formData.append('month', month);
        formData.append('paged', paged);

        try {
            const response = await fetch(ajax_object.ajax_url, { method: 'POST', body: formData });
            const json = await response.json();
            if (json.success) {
                postsContainer.innerHTML = json.data.posts_html;
                if (paginationContainer) paginationContainer.innerHTML = json.data.pagination_html;
                attachListeners();
            }
        } catch (error) {
            console.error('Event filtering error:', error);
        } finally {
            postsContainer.style.opacity = '1';
        }
    };

    // Eventsページでは、初回表示時にもAjaxでコンテンツを読み込む
    const initialTag = filterButtonsContainer?.querySelector('.is-active')?.dataset.tag || 'all';
    const initialMonth = monthSelect ? monthSelect.value : 'all';
    fetchPosts(initialTag, initialMonth, 1);
}
