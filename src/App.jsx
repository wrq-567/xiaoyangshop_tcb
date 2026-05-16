import React, { useState, useEffect, useRef } from 'react';
import {
  Store, MessageCircle, User, Plus, Trash2,
  ThumbsUp, Coins, Image as ImageIcon, Send,
  X, Edit3, AlertCircle, Loader2
} from 'lucide-react';

// === 引入腾讯云 TCB SDK ===
import cloudbase from '@cloudbase/js-sdk';

// === 初始化 TCB ===
const tcbEnvId = typeof __tcb_env_id !== 'undefined' ? __tcb_env_id : 'xiaoyang-d1gk1l79t26f6f321'; // 替换为你的真实环境ID
const app = cloudbase.init({
  env: tcbEnvId
});
const auth = app.auth();
const db = app.database();
// TCB SDK 通常会自动处理实时监听的底层连接，无需特别指定 appId 路径，直接操作对应的集合即可

export default function App() {
  // === 导航状态 ===
  const [activeTab, setActiveTab] = useState('store');
  
  // === 核心数据状态 ===
  const [authUser, setAuthUser] = useState(null); // TCB Auth 状态
  const [user, setUser] = useState(null);         // 数据库中的个人档案 (名字、头像、积分)
  const [products, setProducts] = useState([]);   // 全网同步的商品
  const [categories, setCategories] = useState(['全部', '未分类']); // 全网同步的分类
  const [messages, setMessages] = useState([]);   // 全网同步的社区消息
  const [currentCategory, setCurrentCategory] = useState('全部');

  // === 页面交互状态 ===
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', category: '未分类', cost: '', imageUrl: '' });
  const [newCategoryInput, setNewCategoryInput] = useState('');
  
  const [customPointsInput, setCustomPointsInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileEdit, setProfileEdit] = useState({ name: '', avatar: '' });

  // === 弹窗状态 ===
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const messagesEndRef = useRef(null);

  // === 工具函数：格式化时间 ===
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  };

  // === 第一步：处理 TCB 用户身份认证 ===
  useEffect(() => {
    const initAuth = async () => {
      try {
        const loginState = await auth.getLoginState();
        if (!loginState) {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await auth.customAuthProvider().signIn(__initial_auth_token);
          } else {
            await auth.anonymousAuthProvider().signIn(); // TCB 匿名登录
          }
        }
      } catch (err) {
        console.error("认证失败:", err);
      }
    };
    initAuth();

    // 监听 TCB 登录状态变化
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setAuthUser(currentUser);
    });

    return () => {
       if(typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // === 第二步：监听 TCB 云端实时数据 ===
  useEffect(() => {
    if (!authUser) return;

    let profileWatcher, catWatcher, prodWatcher, msgWatcher;

    // 1. 监听当前用户的私有档案
    profileWatcher = db.collection('shop_users').where({ _id: authUser.uid }).watch({
      onChange: (snapshot) => {
        if (snapshot.docs.length > 0) {
          setUser({ id: authUser.uid, ...snapshot.docs[0] });
        } else {
          // 新用户：自动创建默认档案
          const defaultUser = { name: '小羊' + Math.floor(Math.random() * 1000), avatar: '', points: 500 };
          db.collection('shop_users').doc(authUser.uid).set(defaultUser);
        }
      },
      onError: (err) => console.error("读取用户失败:", err)
    });

    // 2. 监听全网公共商品分类
    catWatcher = db.collection('shop_categories').watch({
      onChange: (snapshot) => {
        let cats = snapshot.docs.map(d => d._id); // TCB 主键是 _id
        if (cats.length === 0) {
          // 初始化默认分类
          db.collection('shop_categories').doc('小零食').set({ timestamp: Date.now() });
          db.collection('shop_categories').doc('文具').set({ timestamp: Date.now() });
        } else {
          setCategories(['全部', ...cats.filter(c => c !== '全部' && c !== '未分类'), '未分类']);
        }
      },
      onError: (err) => console.error(err)
    });

    // 3. 监听全网公共商品列表
    prodWatcher = db.collection('shop_products')
      .orderBy('timestamp', 'desc')
      .watch({
        onChange: (snapshot) => {
          const items = snapshot.docs.map(d => ({ id: d._id, ...d }));
          setProducts(items);
        },
        onError: (err) => console.error("商品监听失败:", err)
      });

    // 4. 监听全网社区聊天消息
    msgWatcher = db.collection('shop_messages')
      .orderBy('timestamp', 'asc')
      .watch({
        onChange: (snapshot) => {
          const msgs = snapshot.docs.map(d => ({ id: d._id, ...d }));
          setMessages(msgs);
        },
        onError: (err) => console.error("消息监听失败:", err)
      });

    return () => { 
      if(profileWatcher) profileWatcher.close(); 
      if(catWatcher) catWatcher.close(); 
      if(prodWatcher) prodWatcher.close(); 
      if(msgWatcher) msgWatcher.close(); 
    };
  }, [authUser]);

  // === 自动滚动社区消息 ===
  useEffect(() => {
    if (activeTab === 'community') {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, activeTab]);

  const openModal = (title, message, onConfirm = null) => { setModal({ isOpen: true, title, message, onConfirm }); };
  const closeModal = () => setModal({ isOpen: false, title: '', message: '', onConfirm: null });

  // === 前端图片智能压缩 ===
  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      openModal('提示', '只能上传图片类型的文件哦！');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400; const MAX_HEIGHT = 400;
        let width = img.width; let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        callback(dataUrl);
      };
    };
  };

  // === TCB 云端操作：添加分类 ===
  const handleAddNewCategory = async () => {
    const catName = newCategoryInput.trim();
    if (catName && !categories.includes(catName)) {
      await db.collection('shop_categories').doc(catName).set({ timestamp: Date.now() });
      setNewProduct(prev => ({ ...prev, category: catName }));
      setNewCategoryInput('');
    }
  };

  const openAddProduct = () => {
    setEditProductId(null);
    setNewProduct({ name: '', category: '未分类', cost: '', imageUrl: '' });
    setIsAddingProduct(true);
  };

  const handleEditProduct = (product) => {
    setEditProductId(product.id);
    setNewProduct({
      name: product.name,
      category: product.category,
      cost: product.cost.toString(),
      imageUrl: product.imageUrl || ''
    });
    setIsAddingProduct(true);
  };

  const closeProductForm = () => {
    setIsAddingProduct(false);
    setEditProductId(null);
    setNewProduct({ name: '', category: '未分类', cost: '', imageUrl: '' });
  };

  // === TCB 云端操作：保存商品 (上架/修改) ===
  const submitProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.cost) {
      openModal('提示', '商品名称和兑换积分不能为空哦！');
      return;
    }

    if (editProductId) {
      await db.collection('shop_products').doc(editProductId).update({
        name: newProduct.name,
        cost: parseInt(newProduct.cost) || 0,
        category: newProduct.category,
        imageUrl: newProduct.imageUrl
      });
    } else {
      await db.collection('shop_products').add({
        name: newProduct.name,
        cost: parseInt(newProduct.cost) || 0,
        category: newProduct.category,
        imageUrl: newProduct.imageUrl,
        timestamp: Date.now()
      });
    }
    closeProductForm();
  };

  // === TCB 云端操作：下架商品 ===
  const confirmDeleteProduct = (id) => {
    openModal('下架商品', '确定要将这款商品从店铺下架吗？所有人都会看到它消失哦。', async () => {
      await db.collection('shop_products').doc(id).remove();
      closeModal();
    });
  };

  // === TCB 云端操作：删除分类 ===
  const confirmDeleteCategory = (categoryName) => {
    if (categoryName === '全部' || categoryName === '未分类') return;
    openModal('删除分类', `确定要删除分类 "${categoryName}" 吗？该分类下的商品将被自动移动到 "未分类"。`, async () => {
      await db.collection('shop_categories').doc(categoryName).remove();
      // 批量更新所属分类的商品
      products.forEach(p => {
        if (p.category === categoryName) {
          db.collection('shop_products').doc(p.id).update({ category: '未分类' });
        }
      });
      setCurrentCategory('全部');
      closeModal();
    });
  };

  // === TCB 云端操作：兑换商品 ===
  const handleRedeem = (product) => {
    if (user.points < product.cost) {
      openModal('积分不足', '您当前的积分不够兑换这款商品哦，快去赚取积分吧！');
      return;
    }
    openModal('确认兑换', `要花费 ${product.cost} 积分兑换【${product.name}】吗？`, async () => {
      await db.collection('shop_users').doc(authUser.uid).update({
        points: user.points - product.cost
      });
      await db.collection('shop_messages').add({
        sender: '系统',
        text: `🎉 ${user.name} 刚刚兑换了【${product.name}】！`,
        type: 'system',
        timestamp: Date.now()
      });
      closeModal();
    });
  };

  // === TCB 云端操作：发送推荐 ===
  const handleRecommend = async (product) => {
    await db.collection('shop_messages').add({
      sender: user.name,
      text: `强烈推荐好物：【${product.name}】！只需 ${product.cost} 积分，大家快来看看吧！`,
      type: 'recommend',
      product: product,
      timestamp: Date.now()
    });
    setActiveTab('community');
  };

  // === TCB 云端操作：个人积分充值 ===
  const handleAddPoints = async () => {
    const pts = parseInt(customPointsInput);
    if (!isNaN(pts) && pts > 0) {
      await db.collection('shop_users').doc(authUser.uid).update({
        points: user.points + pts
      });
      setCustomPointsInput('');
    }
  };

  // === TCB 云端操作：保存个人资料 ===
  const handleSaveProfile = async () => {
    await db.collection('shop_users').doc(authUser.uid).update({
      name: profileEdit.name || user.name,
      avatar: profileEdit.avatar
    });
    setIsEditingProfile(false);
  };

  // === TCB 云端操作：发送聊天消息 ===
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    await db.collection('shop_messages').add({
      sender: user.name,
      text: chatInput,
      type: 'chat',
      timestamp: Date.now()
    });
    setChatInput('');
  };

  // === 加载状态拦截 ===
  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-slate-800 text-white font-black">
        <Loader2 className="w-12 h-12 mb-4 text-emerald-400 animate-spin" />
        正在连接羊村服务器...
      </div>
    );
  }

  // === 页面渲染区 (保持原版 UI 不变) ===
 
  // === 页面渲染区 ===
  const renderStore = () => (
    <div className="flex flex-col h-full relative">
      <div className="bg-white px-4 py-3 border-b-4 border-slate-900 shadow-sm flex flex-col space-y-3 z-10 shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="font-black text-lg text-slate-800">商品分类</h2>
          <button 
            onClick={openAddProduct} 
            className="flex items-center text-sm font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <Plus className="w-4 h-4 mr-1"/> 上架商品
          </button>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2 pt-1 no-scrollbar items-center">
           {categories.map(cat => (
              <div key={cat} className="relative group shrink-0">
                <button
                  onClick={() => setCurrentCategory(cat)}
                  className={`px-4 py-1.5 rounded-full font-bold text-sm border-2 transition-all whitespace-nowrap ${
                    currentCategory === cat
                      ? 'bg-emerald-400 text-slate-900 border-slate-900 shadow-[2px_2px_0_0_#0f172a]'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-900 hover:text-slate-900 hover:shadow-[2px_2px_0_0_#0f172a]'
                  }`}
                >
                  {cat}
                </button>
                {currentCategory === cat && !['全部', '未分类'].includes(cat) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); confirmDeleteCategory(cat); }}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 border-2 border-slate-900 z-10 hover:scale-110 transition-transform"
                    title="删除该分类"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {products.filter(p => currentCategory === '全部' || p.category === currentCategory).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
             <Store className="w-16 h-16 mb-2 opacity-50" />
             <p className="font-bold">这个分类下还没有商品哦~</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-12 items-start">
            {products.filter(p => currentCategory === '全部' || p.category === currentCategory).map(product => (
              <div key={product.id} className="bg-white border-4 border-slate-900 rounded-xl overflow-hidden shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:translate-x-[1px] hover:shadow-[6px_6px_0_0_#0f172a] transition-all flex flex-col group relative">
                
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                  <button onClick={() => handleEditProduct(product)} className="p-1.5 bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] transition-colors" title="修改商品">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => confirmDeleteProduct(product.id)} className="p-1.5 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] transition-colors" title="下架商品">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-full aspect-square border-b-4 border-slate-900 bg-slate-100 relative overflow-hidden shrink-0">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-black rounded border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a]">
                    {product.category}
                  </span>
                </div>

                <div className="p-3 flex flex-col flex-1 bg-white min-h-[110px]">
                  <h3 className="font-black text-slate-800 text-[15px] leading-snug break-words whitespace-normal mb-3">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto pt-1 flex items-center justify-between gap-1 flex-wrap">
                    <div className="flex items-center text-indigo-600">
                      <Coins className="w-4 h-4 mr-0.5" strokeWidth={3} />
                      <span className="font-black text-lg leading-none">{product.cost}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button onClick={() => handleRecommend(product)} className="p-1.5 bg-indigo-50 text-indigo-600 border-2 border-slate-900 rounded-lg shadow-[2px_2px_0_0_#0f172a] hover:bg-indigo-200 active:translate-y-[2px] active:shadow-none transition-all" title="推荐到社区">
                        <ThumbsUp className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                      <button onClick={() => handleRedeem(product)} className="px-2.5 py-1.5 bg-slate-900 text-white font-black text-sm border-2 border-slate-900 rounded-lg shadow-[2px_2px_0_0_#0f172a] hover:bg-slate-800 active:translate-y-[2px] active:shadow-none transition-all whitespace-nowrap">
                        兑换
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAddingProduct && (
        <div className="absolute inset-0 bg-slate-50 z-20 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-white px-4 py-3 border-b-4 border-slate-900 flex justify-between items-center shadow-sm shrink-0">
            <h2 className="font-black text-lg text-slate-800">{editProductId ? '修改商品' : '上架新商品'}</h2>
            <button onClick={closeProductForm} className="p-1.5 bg-slate-100 rounded-lg border-2 border-slate-900 hover:bg-slate-200 shadow-[2px_2px_0_0_#0f172a]">
              <X className="w-4 h-4 text-slate-800"/>
            </button>
          </div>
          <div className="p-5 flex-1 overflow-y-auto space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">商品名称</label>
              <input type="text" className="w-full border-2 border-slate-900 rounded-lg p-3 font-medium bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="输入商品名称" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">商品图片 (本地上传)</label>
              <div className="flex items-center gap-3">
                 <div className="w-16 h-16 shrink-0 bg-slate-100 border-2 border-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                    {newProduct.imageUrl ? <img src={newProduct.imageUrl} className="w-full h-full object-cover"/> : <ImageIcon className="w-6 h-6 text-slate-400"/>}
                 </div>
                 <input 
                    type="file" 
                    accept="image/*"
                    className="flex-1 w-full text-sm font-medium text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-slate-900 file:text-sm file:font-black file:bg-indigo-100 file:text-slate-900 hover:file:bg-indigo-200 cursor-pointer transition-all" 
                    onChange={e => handleImageUpload(e, (dataUrl) => setNewProduct({...newProduct, imageUrl: dataUrl}))} 
                 />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">兑换积分</label>
              <input type="number" className="w-full border-2 border-slate-900 rounded-lg p-3 font-medium bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100" value={newProduct.cost} onChange={e => setNewProduct({...newProduct, cost: e.target.value})} placeholder="例如: 100" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">所属分类</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.filter(c => c !== '全部').map(cat => (
                  <button key={cat} onClick={() => setNewProduct({...newProduct, category: cat})} className={`px-3 py-1.5 border-2 border-slate-900 rounded-lg text-sm font-bold transition-all shadow-[2px_2px_0_0_#0f172a] active:translate-y-[2px] active:shadow-none ${newProduct.category === cat ? 'bg-emerald-400 text-slate-900' : 'bg-white text-slate-700'}`}>{cat}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" className="flex-1 border-2 border-slate-900 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-100 bg-white" placeholder="新分类名称" value={newCategoryInput} onChange={e => setNewCategoryInput(e.target.value)} />
                <button onClick={handleAddNewCategory} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] active:translate-y-[2px] active:shadow-none whitespace-nowrap">添加</button>
              </div>
            </div>
            
            <button onClick={submitProduct} className="w-full mt-4 py-3 bg-indigo-500 text-white font-black text-lg border-2 border-slate-900 rounded-xl shadow-[4px_4px_0_0_#0f172a] active:translate-y-[4px] active:shadow-none transition-all">
              {editProductId ? '保存修改 (所有人可见)' : '确认上架 (所有人可见)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCommunity = () => (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="bg-white px-4 py-3 border-b-4 border-slate-900 flex justify-between items-center shadow-sm z-10 shrink-0">
        <h2 className="font-black text-lg text-slate-800 tracking-tight">羊村小喇叭</h2>
        <div className="flex items-center space-x-1.5 text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-full border-2 border-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs">实时在线群聊</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 font-bold mt-10">社区空空如也，快来发第一条消息吧！</div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === user.name ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1 px-1">
               <span className="text-xs font-bold text-slate-600">{msg.sender}</span>
               <span className="text-[10px] text-slate-400 font-medium">{formatTime(msg.timestamp)}</span>
            </div>
            
            {msg.type === 'system' ? (
              <div className="bg-slate-200 border-2 border-slate-300 text-slate-700 text-sm font-bold px-4 py-2 rounded-xl text-center self-center my-2">
                {msg.text}
              </div>
            ) : msg.type === 'recommend' ? (
              <div className="bg-indigo-50 border-4 border-slate-900 rounded-xl p-3 max-w-[85%] shadow-[4px_4px_0_0_#0f172a]">
                <p className="font-medium text-slate-800 text-sm mb-2">{msg.text}</p>
                {msg.product && (
                   <div className="flex items-center bg-white border-2 border-slate-900 rounded-lg p-2 mt-2 gap-3 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => { setActiveTab('store'); setCurrentCategory('全部'); }}>
                      <div className="w-12 h-12 bg-slate-100 rounded border-2 border-slate-900 overflow-hidden shrink-0">
                         {msg.product.imageUrl ? <img src={msg.product.imageUrl} className="w-full h-full object-cover"/> : <ImageIcon className="w-6 h-6 m-auto text-slate-400 mt-2"/>}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="font-black text-sm truncate">{msg.product.name}</div>
                         <div className="text-indigo-600 font-black text-xs mt-0.5">{msg.product.cost} 积分</div>
                      </div>
                   </div>
                )}
              </div>
            ) : (
              <div className={`border-4 border-slate-900 rounded-xl p-3 max-w-[80%] font-medium shadow-[4px_4px_0_0_#0f172a] ${msg.sender === user.name ? 'bg-emerald-400 text-slate-900 rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'}`}>
                {msg.text}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="bg-white p-3 border-t-4 border-slate-900 flex gap-2 shrink-0 z-10">
        <input
          type="text"
          className="flex-1 border-2 border-slate-900 bg-slate-50 rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-colors"
          placeholder="分享你的好物心得..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
        />
        <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );

  const renderProfile = () => (
    <div className="flex flex-col h-full bg-slate-50 p-4 space-y-6 overflow-y-auto">
      <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 flex items-center shadow-[4px_4px_0_0_#0f172a] relative overflow-hidden">
        <div className="w-20 h-20 rounded-full border-4 border-slate-900 bg-emerald-100 flex items-center justify-center overflow-hidden shrink-0 z-10">
          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-emerald-600" strokeWidth={2.5} />}
        </div>
        <div className="ml-5 z-10">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-800">{user.name}</h2>
            <button onClick={() => { setProfileEdit({name: user.name, avatar: user.avatar}); setIsEditingProfile(true); }} className="p-1 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded border border-transparent hover:border-indigo-200 transition-colors">
              <Edit3 className="w-4 h-4"/>
            </button>
          </div>
          <div className="mt-2 inline-flex items-center bg-slate-100 border-2 border-slate-900 px-3 py-1 rounded-full text-sm">
             <span className="font-bold text-slate-600 mr-2">云端UID:</span>
             <span className="font-mono font-bold text-slate-800">{user.id.substring(0, 6)}...</span>
          </div>
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-100 rounded-full border-4 border-slate-900 opacity-50"></div>
      </div>

      <div className="bg-indigo-100 border-4 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0_0_#0f172a]">
        <h3 className="font-black text-lg text-slate-900 mb-4 flex items-center">
          <Coins className="w-5 h-5 mr-2 text-indigo-600" strokeWidth={3}/> 赚取积分
        </h3>
        <div className="bg-white border-2 border-slate-900 rounded-xl p-4 flex flex-col gap-3">
           <label className="text-sm font-bold text-slate-700">充值个人专属积分</label>
           <div className="flex gap-2">
             <input
               type="number"
               className="flex-1 border-2 border-slate-900 rounded-lg px-3 py-2 font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
               placeholder="输入需要增加的数值"
               value={customPointsInput}
               onChange={e => setCustomPointsInput(e.target.value)}
             />
             <button
               onClick={handleAddPoints}
               className="px-4 py-2 bg-emerald-400 text-slate-900 font-black rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] active:translate-y-[2px] active:shadow-none transition-all whitespace-nowrap"
             >
               充值
             </button>
           </div>
        </div>
      </div>

      {isEditingProfile && (
         <div className="absolute inset-0 bg-slate-50 z-30 p-6 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
            <h2 className="text-2xl font-black text-slate-900 mb-6">编辑资料 (全网可见)</h2>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">专属昵称</label>
                  <input type="text" className="w-full border-4 border-slate-900 rounded-xl p-3 font-bold text-lg outline-none focus:ring-4 focus:ring-indigo-100" value={profileEdit.name} onChange={e => setProfileEdit({...profileEdit, name: e.target.value})} />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">专属头像 (本地上传)</label>
                  <div className="flex items-center gap-3 mt-2">
                     <div className="w-16 h-16 shrink-0 bg-slate-100 border-4 border-slate-900 rounded-full overflow-hidden flex items-center justify-center">
                        {profileEdit.avatar ? <img src={profileEdit.avatar} className="w-full h-full object-cover"/> : <User className="w-6 h-6 text-slate-400"/>}
                     </div>
                     <input 
                        type="file" 
                        accept="image/*"
                        className="flex-1 w-full text-sm font-medium text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-slate-900 file:text-sm file:font-black file:bg-emerald-100 file:text-slate-900 hover:file:bg-emerald-200 cursor-pointer transition-all" 
                        onChange={e => handleImageUpload(e, (dataUrl) => setProfileEdit({...profileEdit, avatar: dataUrl}))} 
                     />
                  </div>
               </div>
            </div>
            <div className="mt-auto flex gap-3 pt-6">
               <button onClick={() => setIsEditingProfile(false)} className="flex-1 py-3 bg-white font-black text-slate-700 border-4 border-slate-900 rounded-xl shadow-[4px_4px_0_0_#0f172a] active:translate-y-[4px] active:shadow-none transition-all">取消</button>
               <button onClick={handleSaveProfile} className="flex-1 py-3 bg-slate-900 font-black text-white border-4 border-slate-900 rounded-xl shadow-[4px_4px_0_0_#0f172a] active:translate-y-[4px] active:shadow-none transition-all">保存</button>
            </div>
         </div>
      )}
    </div>
  );

  return (
    <div className="h-screen w-full flex justify-center items-center bg-slate-800 font-sans sm:p-6">
      <div className="w-full h-full sm:max-w-[400px] sm:h-[800px] sm:max-h-full sm:rounded-[2rem] bg-slate-100 flex flex-col relative overflow-hidden sm:border-8 border-slate-900 sm:shadow-[16px_16px_0_0_#0f172a]">
        
        <header className="bg-white border-b-4 border-slate-900 px-5 py-4 flex justify-between items-center z-10 shrink-0">
          <h1 className="text-xl font-black tracking-tight text-slate-900 flex items-center">
            <Store className="w-6 h-6 mr-2 text-indigo-500" strokeWidth={3} />
            小羊小卖铺
          </h1>
          <div className="flex items-center space-x-1.5 bg-emerald-100 border-2 border-slate-900 px-3 py-1.5 rounded-full shadow-[2px_2px_0_0_#0f172a]">
            <Coins className="w-5 h-5 text-emerald-600" strokeWidth={3} />
            <span className="font-black text-emerald-800 text-sm tracking-wide">{user.points}</span>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative bg-slate-50">
          {activeTab === 'store' && renderStore()}
          {activeTab === 'community' && renderCommunity()}
          {activeTab === 'profile' && renderProfile()}
        </main>

        <nav className="bg-white border-t-4 border-slate-900 flex justify-around p-3 shrink-0 z-20">
          <button
            onClick={() => setActiveTab('store')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl w-16 transition-all ${activeTab === 'store' ? 'bg-slate-900 text-emerald-400 shadow-[4px_4px_0_0_#0f172a] -translate-y-1 border-2 border-slate-900' : 'text-slate-500 hover:text-slate-900 border-2 border-transparent'}`}
          >
            <Store className="w-6 h-6 mb-1" strokeWidth={activeTab === 'store' ? 2.5 : 2} />
            <span className="text-[11px] font-black">商城</span>
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl w-16 transition-all ${activeTab === 'community' ? 'bg-slate-900 text-emerald-400 shadow-[4px_4px_0_0_#0f172a] -translate-y-1 border-2 border-slate-900' : 'text-slate-500 hover:text-slate-900 border-2 border-transparent'}`}
          >
            <MessageCircle className="w-6 h-6 mb-1" strokeWidth={activeTab === 'community' ? 2.5 : 2} />
            <span className="text-[11px] font-black">社区</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl w-16 transition-all ${activeTab === 'profile' ? 'bg-slate-900 text-emerald-400 shadow-[4px_4px_0_0_#0f172a] -translate-y-1 border-2 border-slate-900' : 'text-slate-500 hover:text-slate-900 border-2 border-transparent'}`}
          >
            <User className="w-6 h-6 mb-1" strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span className="text-[11px] font-black">我的</span>
          </button>
        </nav>

        {modal.isOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
            <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0_0_#0f172a] rounded-2xl p-6 w-full max-w-sm flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-xl font-black text-slate-800 mb-3 flex items-center">
                {modal.onConfirm ? <AlertCircle className="w-5 h-5 mr-2 text-indigo-500" /> : null}
                {modal.title}
              </h3>
              <p className="text-slate-700 font-bold mb-6 leading-relaxed text-sm">{modal.message}</p>
              <div className="flex space-x-3 justify-end mt-auto">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black border-2 border-slate-900 rounded-xl shadow-[2px_2px_0_0_#0f172a] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  {modal.onConfirm ? '取消' : '知道啦'}
                </button>
                {modal.onConfirm && (
                  <button
                    onClick={modal.onConfirm}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-black border-2 border-slate-900 rounded-xl shadow-[2px_2px_0_0_#0f172a] active:translate-y-[2px] active:shadow-none transition-all"
                  >
                    确定
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}