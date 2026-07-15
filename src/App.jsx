import React, { useState, useEffect, useRef } from 'react';
import {
  Store, MessageCircle, User, Plus, Trash2,
  ThumbsUp, Coins, Image as ImageIcon, Send,
  X, Edit3, AlertCircle, Loader2, RefreshCw,
  LayoutGrid, ArrowLeft, ClipboardList, Bone,
  Scale, Ruler, Droplets, Bug, Calendar, Save, CheckSquare
} from 'lucide-react';

// ==========================================
// 🚀【部署须知】🚀
// 当你准备部署到真实的 TCB (云开发) 环境时，请：
// 1. 取消下面 【真实 TCB 环境代码】 的注释
// 2. 将下面 【模拟环境代码】 整块注释或删除
// ==========================================


// --- 真实 TCB 环境代码 (部署时取消注释) ---

import cloudbase from '@cloudbase/js-sdk';
const app = cloudbase.init({
  env: 'xiaoyang-d1gk1l79t26f6f321' // 你的环境ID
});
// 开启本地持久化，用户刷新页面/下次打开依然是原账号
const auth = app.auth({ persistence: 'local' });
const db = app.database();



// // --- 模拟环境代码 (当前开启，用于在线预览) ---
// const mockWatchers = {
//   shop_users: [],
//   shop_categories: [],
//   shop_products: [],
//   shop_messages: [],
//   memo_dogs: [],
//   memo_notes: []
// };

// // 触发数据更新推送
// const triggerWatchers = (name) => {
//   if (mockWatchers[name]) {
//     mockWatchers[name].forEach(fn => fn());
//   }
// };

// // 模拟登录
// let currentMockUid = localStorage.getItem('mock_current_uid') || 'uid_' + Math.random().toString(36).substr(2, 8);
// localStorage.setItem('mock_current_uid', currentMockUid);

// // 模拟数据库实现
// const db = {
//   collection: (name) => ({
//     where: (condition) => ({
//       watch: ({ onChange }) => {
//         const trigger = () => {
//           if (name === 'shop_users') {
//              const uid = condition._id;
//              const userStr = localStorage.getItem('mock_user_' + uid);
//              let userDoc;
//              if (userStr) {
//                 userDoc = JSON.parse(userStr);
//              } else {
//                 userDoc = { name: '小羊' + Math.floor(Math.random() * 1000), avatar: '', points: 500 };
//                 localStorage.setItem('mock_user_' + uid, JSON.stringify(userDoc));
//              }
//              onChange({ docs: [{ _id: uid, ...userDoc }] });
//           }
//         };
//         mockWatchers[name].push(trigger);
//         setTimeout(trigger, 50); 
//         return { close: () => { mockWatchers[name] = mockWatchers[name].filter(cb => cb !== trigger) } };
//       }
//     }),
//     watch: ({ onChange }) => {
//       const trigger = () => {
//          if (name === 'shop_categories') {
//              let catsStr = localStorage.getItem('mock_cats');
//              if (!catsStr) {
//                  catsStr = JSON.stringify(['小零食', '文具']);
//                  localStorage.setItem('mock_cats', catsStr);
//              }
//              const cats = JSON.parse(catsStr);
//              onChange({ docs: cats.map(c => ({ _id: c })) });
//          }
//          if (name === 'shop_products') {
//              const prods = JSON.parse(localStorage.getItem('mock_prods') || '[]');
//              onChange({ docs: prods.map(p => ({ ...p, _id: p.id })) });
//          }
//          if (name === 'shop_messages') {
//              const msgs = JSON.parse(localStorage.getItem('mock_msgs') || '[]');
//              onChange({ docs: msgs.map(m => ({ ...m, _id: m.id })) });
//          }
//          if (name === 'memo_dogs') {
//              let dogsStr = localStorage.getItem('mock_dogs');
//              if (!dogsStr) {
//                  // 初始化两只狗狗的档案
//                  const defaultDogs = [
//                    { id: 'chocolate', name: '巧克力', birthday: '2020-05-20', weight: '5.2', shoulder: '35', back: '42', lastBath: '2024-05-01', lastDeworm: '2024-04-15', notes: '性格比较活泼，最近换毛期需要多梳毛。', avatar: '' },
//                    { id: 'xiaopi', name: '小屁', birthday: '2021-10-10', weight: '4.8', shoulder: '32', back: '38', lastBath: '2024-05-10', lastDeworm: '2024-03-20', notes: '肠胃偏弱，注意饮食规律。', avatar: '' }
//                  ];
//                  localStorage.setItem('mock_dogs', JSON.stringify(defaultDogs));
//                  dogsStr = JSON.stringify(defaultDogs);
//              }
//              const dogs = JSON.parse(dogsStr);
//              // 模拟环境依然返回，但我们保证它包含自定义的 id 字段
//              onChange({ docs: dogs.map(d => ({ ...d, _id: d._id || d.id })) });
//          }
//          if (name === 'memo_notes') {
//              const notes = JSON.parse(localStorage.getItem('mock_notes') || '[]');
//              onChange({ docs: notes.map(n => ({ ...n, _id: n.id })) });
//          }
//       };
//       mockWatchers[name].push(trigger);
//       setTimeout(trigger, 50); 
//       return { close: () => { mockWatchers[name] = mockWatchers[name].filter(cb => cb !== trigger) } };
//     },
//     add: async (data) => {
//        if (name === 'shop_products') {
//           const prods = JSON.parse(localStorage.getItem('mock_prods') || '[]');
//           const newProd = { id: Date.now().toString(), ...data };
//           localStorage.setItem('mock_prods', JSON.stringify([newProd, ...prods]));
//        }
//        if (name === 'shop_messages') {
//           const msgs = JSON.parse(localStorage.getItem('mock_msgs') || '[]');
//           const newMsg = { id: Date.now().toString(), ...data };
//           localStorage.setItem('mock_msgs', JSON.stringify([...msgs, newMsg]));
//        }
//        if (name === 'memo_notes') {
//           const notes = JSON.parse(localStorage.getItem('mock_notes') || '[]');
//           const newNote = { id: Date.now().toString(), ...data };
//           localStorage.setItem('mock_notes', JSON.stringify([newNote, ...notes]));
//        }
//        triggerWatchers(name); 
//     },
//     doc: (docId) => ({
//       set: async (data) => {
//          if (name === 'shop_categories') {
//              let cats = JSON.parse(localStorage.getItem('mock_cats') || '[]');
//              if(!cats.includes(docId)) { localStorage.setItem('mock_cats', JSON.stringify([...cats, docId])); }
//          }
//          if (name === 'shop_users') { localStorage.setItem('mock_user_' + docId, JSON.stringify(data)); }
//          triggerWatchers(name);
//       },
//       update: async (data) => {
//          if (name === 'shop_users') {
//              const user = JSON.parse(localStorage.getItem('mock_user_' + docId) || '{}');
//              localStorage.setItem('mock_user_' + docId, JSON.stringify({ ...user, ...data }));
//          }
//          if (name === 'shop_products') {
//             let prods = JSON.parse(localStorage.getItem('mock_prods') || '[]');
//             prods = prods.map(p => p.id === docId ? { ...p, ...data } : p);
//             localStorage.setItem('mock_prods', JSON.stringify(prods));
//          }
//          if (name === 'memo_dogs') {
//             let dogs = JSON.parse(localStorage.getItem('mock_dogs') || '[]');
//             // 使用自定义的 id 字段进行匹配更新
//             dogs = dogs.map(d => (d.id === docId || d._id === docId) ? { ...d, ...data } : d);
//             localStorage.setItem('mock_dogs', JSON.stringify(dogs));
//          }
//          triggerWatchers(name);
//       },
//       remove: async () => {
//          if (name === 'shop_products') {
//              let prods = JSON.parse(localStorage.getItem('mock_prods') || '[]');
//              prods = prods.filter(p => p.id !== docId);
//              localStorage.setItem('mock_prods', JSON.stringify(prods));
//          }
//          if (name === 'shop_categories') {
//              let cats = JSON.parse(localStorage.getItem('mock_cats') || '[]');
//              cats = cats.filter(c => c !== docId);
//              localStorage.setItem('mock_cats', JSON.stringify(cats));
//          }
//          if (name === 'memo_notes') {
//              let notes = JSON.parse(localStorage.getItem('mock_notes') || '[]');
//              notes = notes.filter(n => n.id !== docId);
//              localStorage.setItem('mock_notes', JSON.stringify(notes));
//          }
//          triggerWatchers(name);
//       }
//     })
//   })
// };

// const auth = {
//    getLoginState: async () => ({ user: { uid: localStorage.getItem('mock_current_uid') } }),
//    anonymousAuthProvider: () => ({ signIn: async () => {} })
// };
// // --- 模拟代码结束 ---


export default function App() {
  // === 全局应用状态 ===
  const [currentApp, setCurrentApp] = useState('home'); // 'home', 'shop', 'memo'
  const [authUser, setAuthUser] = useState(null); 
  const [user, setUser] = useState(null);         
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  
  // === 小卖铺状态 ===
  const [activeShopTab, setActiveShopTab] = useState('store');
  const [products, setProducts] = useState([]);   
  const [categories, setCategories] = useState(['全部', '未分类']); 
  const [messages, setMessages] = useState([]);   
  const [currentCategory, setCurrentCategory] = useState('全部');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', category: '未分类', cost: '', imageUrl: '' });
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [customPointsInput, setCustomPointsInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [recoverUidInput, setRecoverUidInput] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileEdit, setProfileEdit] = useState({ name: '', avatar: '', uid: '' });
  const messagesEndRef = useRef(null);

  // === 备忘录状态 ===
  const [activeMemoTab, setActiveMemoTab] = useState('dogs'); // 'dogs', 'notes'
  const [memoDogs, setMemoDogs] = useState([]);
  const [memoNotes, setMemoNotes] = useState([]);
  const [editingDog, setEditingDog] = useState(null);
  const [dogForm, setDogForm] = useState(null);
  const [newNoteInput, setNewNoteInput] = useState('');

  // === 通用方法 ===
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const calculateAge = (birthday) => {
    if (!birthday) return '未设置生日';
    const birthDate = new Date(birthday);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years < 0) return '尚未出生';
    let ageStr = '';
    if (years > 0) ageStr += `${years}岁`;
    if (months > 0) ageStr += `${months}个月`;
    if (days > 0 || ageStr === '') ageStr += `${days}天`;
    return ageStr;
  };

  const openModal = (title, message, onConfirm = null) => { setModal({ isOpen: true, title, message, onConfirm }); };
  const closeModal = () => setModal({ isOpen: false, title: '', message: '', onConfirm: null });

  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { openModal('提示', '只能上传图片哦！'); return; }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width; let height = img.height;
        if (width > height) { if (width > 400) { height *= 400 / width; width = 400; } } 
        else { if (height > 400) { width *= 400 / height; height = 400; } }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.6));
      };
    };
  };

  // === 数据初始化 (全局) ===
  useEffect(() => {
    const initAuth = async () => {
      try {
        const loginState = await auth.getLoginState();
        if (!loginState) await auth.anonymousAuthProvider().signIn();
        setAuthUser(await auth.getLoginState());
      } catch (err) {
        console.error("TCB登录失败:", err);
        openModal("连接失败", "无法连接到云端，请检查网络。");
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (!authUser || !authUser.user || !authUser.user.uid) return;
    const uid = authUser.user.uid;
    let watchers = [];

    // 1. 用户信息
    watchers.push(db.collection('shop_users').where({ _id: uid }).watch({
      onChange: (snapshot) => {
        if (snapshot.docs.length > 0) setUser({ id: uid, ...snapshot.docs[0] });
        else db.collection('shop_users').doc(uid).set({ name: '小羊' + Math.floor(Math.random() * 1000), avatar: '', points: 500 });
      }
    }));
    // 2. 小卖铺 - 分类
    watchers.push(db.collection('shop_categories').watch({
      onChange: (snapshot) => {
        let cats = snapshot.docs.map(d => d._id);
        if (cats.length === 0) setCategories(['全部', '未分类']);
        else setCategories(['全部', ...cats.filter(c => c !== '全部' && c !== '未分类'), '未分类']);
      }
    }));
    // 3. 小卖铺 - 商品
    watchers.push(db.collection('shop_products').watch({
      onChange: (snapshot) => {
        const items = snapshot.docs.map(d => ({ id: d._id, ...d }));
        items.sort((a, b) => b.timestamp - a.timestamp);
        setProducts(items);
      }
    }));
    // 4. 小卖铺 - 留言
    watchers.push(db.collection('shop_messages').watch({
      onChange: (snapshot) => {
        const msgs = snapshot.docs.map(d => ({ id: d._id, ...d }));
        msgs.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(msgs);
      }
    }));
    // 5. 备忘录 - 狗狗
    watchers.push(db.collection('memo_dogs').watch({
      onChange: (snapshot) => {
        // 重要修改：在真实环境中，我们使用 doc 中自定义的 id 字段，如果没有才退回使用 _id
        setMemoDogs(snapshot.docs.map(d => ({ ...d, id: d.id || d._id })));
      }
    }));
    // 6. 备忘录 - 笔记
    watchers.push(db.collection('memo_notes').watch({
      onChange: (snapshot) => {
        const notes = snapshot.docs.map(d => ({ id: d._id, ...d }));
        notes.sort((a, b) => b.timestamp - a.timestamp);
        setMemoNotes(notes);
      }
    }));

    return () => watchers.forEach(w => w.close && w.close());
  }, [authUser]);

  useEffect(() => {
    if (currentApp === 'shop' && activeShopTab === 'community') {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [messages, currentApp, activeShopTab]);


  // ==========================================
  // 【 小 卖 铺 逻 辑 】
  // ==========================================
  const handleAddNewCategory = async () => {
    const catName = newCategoryInput.trim();
    if (catName && !categories.includes(catName)) {
      await db.collection('shop_categories').doc(catName).set({ timestamp: Date.now() });
      setNewProduct(prev => ({ ...prev, category: catName }));
      setNewCategoryInput('');
    }
  };
  const submitProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.cost) { openModal('提示', '名称和积分不能为空哦！'); return; }
    const productData = { name: newProduct.name, cost: parseInt(newProduct.cost) || 0, category: newProduct.category, imageUrl: newProduct.imageUrl };
    if (editProductId) await db.collection('shop_products').doc(editProductId).update(productData); 
    else await db.collection('shop_products').add({ ...productData, timestamp: Date.now() });
    setIsAddingProduct(false);
  };
  const confirmDeleteProduct = (id) => {
    openModal('下架商品', '确定要删除这款商品吗？所有人都会看不见它哦。', async () => {
      await db.collection('shop_products').doc(id).remove(); closeModal();
    });
  };
  const confirmDeleteCategory = (categoryName) => {
    if (categoryName === '全部' || categoryName === '未分类') return;
    openModal('删除分类', `确定删除 "${categoryName}" 吗？该分类商品将移入"未分类"。`, async () => {
      await db.collection('shop_categories').doc(categoryName).remove();
      const updatePromises = products.filter(p => p.category === categoryName).map(p => db.collection('shop_products').doc(p.id).update({ category: '未分类' }));
      await Promise.all(updatePromises);
      setCurrentCategory('全部'); closeModal();
    });
  };
  const handleRedeem = (product) => {
    if (user.points < product.cost) { openModal('积分不足', '您当前的积分不够兑换这款商品哦！'); return; }
    openModal('确认兑换', `花费 ${product.cost} 积分兑换【${product.name}】？`, async () => {
      await db.collection('shop_users').doc(user.id).update({ points: user.points - product.cost });
      await db.collection('shop_messages').add({ sender: '系统通知', text: `🎉 恭喜 ${user.name} 刚刚兑换了【${product.name}】！`, type: 'system', timestamp: Date.now() });
      closeModal();
    });
  };
  const handleRecommend = async (product) => {
    await db.collection('shop_messages').add({ sender: user.name, text: `给大家强烈安利：【${product.name}】！只需 ${product.cost} 积分，快来看看！`, type: 'recommend', product: product, timestamp: Date.now() });
    setActiveShopTab('community');
  };
  const handleAddPoints = async () => {
    const pts = parseInt(customPointsInput);
    if (!isNaN(pts) && pts > 0) {
      await db.collection('shop_users').doc(user.id).update({ points: user.points + pts });
      await db.collection('shop_messages').add({ sender: '系统通知', text: `💰 撒花！${user.name} 刚刚成功充值了 ${pts} 积分！`, type: 'system', timestamp: Date.now() });
      setCustomPointsInput(''); openModal('充值成功', `已为您到账 ${pts} 积分！`);
    }
  };
  const handleRecoverAccount = () => {
    const targetUid = recoverUidInput.trim();
    if (targetUid) {
      localStorage.setItem('mock_current_uid', targetUid);
      setAuthUser({ user: { uid: targetUid } }); setRecoverUidInput('');
      openModal('切换成功', `已成功同步云端数据，当前账号：${targetUid}`);
    }
  };
  const handleSaveProfile = async () => {
    await db.collection('shop_users').doc(user.id).update({ name: profileEdit.name || user.name, avatar: profileEdit.avatar });
    setIsEditingProfile(false);
  };
  const handleSendMessage = async (e) => {
    e.preventDefault(); if (!chatInput.trim()) return;
    await db.collection('shop_messages').add({ sender: user.name, text: chatInput, type: 'chat', timestamp: Date.now() });
    setChatInput('');
  };

  // ==========================================
  // 【 备 忘 录 逻 辑 】
  // ==========================================
  const handleSaveDog = async () => {
    if (!dogForm) return;
    // 使用 TCB 的真实 _id 查找并更新文档。
    // 在上游监听中，我们将 TCB 的 doc._id 赋值给了 d._id，
    // 以确保我们这里有正确的文档标识进行更新。
    const targetId = dogForm._id || dogForm.id; 
    await db.collection('memo_dogs').doc(targetId).update({
      birthday: dogForm.birthday,
      weight: dogForm.weight,
      shoulder: dogForm.shoulder,
      back: dogForm.back,
      lastBath: dogForm.lastBath,
      lastDeworm: dogForm.lastDeworm,
      notes: dogForm.notes,
      avatar: dogForm.avatar // 新增保存头像数据
    });
    setEditingDog(null);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    await db.collection('memo_notes').add({ text: newNoteInput, timestamp: Date.now() });
    setNewNoteInput('');
  };

  const handleDeleteNote = (id) => {
    openModal('删除备忘', '确定删除这条备忘录吗？', async () => {
      await db.collection('memo_notes').doc(id).remove(); closeModal();
    });
  };


  // ==========================================
  // 【 视 图 渲 染 】
  // ==========================================
  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-slate-100 text-slate-800 font-black">
        <Loader2 className="w-12 h-12 mb-4 text-emerald-500 animate-spin" />
        正在接入羊村主干网...
      </div>
    );
  }

  // --- 1. 桌面视图 ---
  const renderHome = () => (
    <div className="flex flex-col h-full bg-slate-100 relative">
      <header className="px-6 pt-10 pb-6 flex flex-col items-center">
         <div className="w-20 h-20 rounded-3xl border-4 border-slate-900 bg-emerald-100 flex items-center justify-center overflow-hidden shadow-[4px_4px_0_0_#0f172a] mb-4">
            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-emerald-600" strokeWidth={2.5} />}
         </div>
         <h1 className="text-2xl font-black text-slate-900 tracking-tight">小羊的百宝箱</h1>
         <p className="text-slate-500 font-bold mt-1 text-sm">欢迎回来，{user.name}！</p>
      </header>

      <div className="flex-1 p-6 grid grid-cols-2 gap-6 content-start">
         <button onClick={() => setCurrentApp('shop')} className="bg-amber-100 border-4 border-slate-900 rounded-3xl p-5 flex flex-col items-center justify-center gap-3 shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[8px_8px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all group">
            <div className="w-16 h-16 bg-white border-4 border-slate-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
               <Store className="w-8 h-8 text-amber-500" strokeWidth={2.5}/>
            </div>
            <span className="font-black text-slate-900 text-lg">小羊小卖铺</span>
         </button>

         <button onClick={() => setCurrentApp('memo')} className="bg-sky-100 border-4 border-slate-900 rounded-3xl p-5 flex flex-col items-center justify-center gap-3 shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[8px_8px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all group">
            <div className="w-16 h-16 bg-white border-4 border-slate-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
               <ClipboardList className="w-8 h-8 text-sky-500" strokeWidth={2.5}/>
            </div>
            <span className="font-black text-slate-900 text-lg">小羊备忘录</span>
         </button>
      </div>
      
      <div className="pb-8 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
         Yang Village OS v1.0
      </div>
    </div>
  );

  // --- 2. 备忘录视图 ---
  const renderMemoApp = () => (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <header className="bg-white border-b-4 border-slate-900 px-4 py-4 flex items-center shadow-sm shrink-0 z-10">
        <button onClick={() => setCurrentApp('home')} className="p-1.5 mr-3 bg-slate-100 hover:bg-slate-200 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] transition-all"><ArrowLeft className="w-5 h-5 text-slate-800"/></button>
        <h1 className="text-xl font-black text-slate-900 flex items-center"><ClipboardList className="w-6 h-6 mr-2 text-sky-500" strokeWidth={3} />小羊备忘录</h1>
      </header>

      <nav className="bg-white border-b-4 border-slate-900 flex shrink-0">
        <button onClick={() => setActiveMemoTab('dogs')} className={`flex-1 py-3 text-sm font-black border-r-4 border-slate-900 transition-colors ${activeMemoTab === 'dogs' ? 'bg-sky-200 text-slate-900' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>狗狗档案</button>
        <button onClick={() => setActiveMemoTab('notes')} className={`flex-1 py-3 text-sm font-black transition-colors ${activeMemoTab === 'notes' ? 'bg-sky-200 text-slate-900' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>常规备忘</button>
      </nav>

      <div className="flex-1 overflow-y-auto p-4">
        {/* 狗狗档案 Tab */}
        {activeMemoTab === 'dogs' && (
          <div className="space-y-6 pb-6">
            {memoDogs.map(dog => (
              <div key={dog.id} className="bg-white border-4 border-slate-900 rounded-2xl overflow-hidden shadow-[6px_6px_0_0_#0f172a] relative">
                 {/* Header */}
                 <div className={`p-4 border-b-4 border-slate-900 flex items-center justify-between ${dog.id === 'chocolate' ? 'bg-amber-100' : 'bg-indigo-100'}`}>
                    <div className="flex items-center gap-3">
                       <div className="w-14 h-14 bg-white border-4 border-slate-900 rounded-full flex items-center justify-center shadow-[2px_2px_0_0_#0f172a] overflow-hidden shrink-0">
                          {dog.avatar ? (
                            <img src={dog.avatar} className="w-full h-full object-cover" />
                          ) : (
                            <Bone className={`w-6 h-6 ${dog.id === 'chocolate' ? 'text-amber-600' : 'text-indigo-600'}`} strokeWidth={3}/>
                          )}
                       </div>
                       <div>
                          <h2 className="text-xl font-black text-slate-900">{dog.name}</h2>
                          <div className="text-sm font-bold text-slate-700 bg-white/50 px-2 py-0.5 rounded border-2 border-slate-900 mt-1 inline-block">
                             {calculateAge(dog.birthday)}
                          </div>
                       </div>
                    </div>
                    <button onClick={() => {setEditingDog(dog.id); setDogForm({...dog});}} className="p-2 bg-white rounded-xl border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] hover:bg-slate-100 transition-colors"><Edit3 className="w-5 h-5 text-slate-800"/></button>
                 </div>
                 {/* Stats Grid */}
                 <div className="grid grid-cols-3 divide-x-4 divide-slate-900 border-b-4 border-slate-900 bg-slate-50">
                    <div className="p-3 flex flex-col items-center">
                       <Scale className="w-5 h-5 text-slate-400 mb-1" />
                       <span className="text-xs font-bold text-slate-500">体重</span>
                       <span className="font-black text-slate-800">{dog.weight} <span className="text-xs">kg</span></span>
                    </div>
                    <div className="p-3 flex flex-col items-center">
                       <Ruler className="w-5 h-5 text-slate-400 mb-1" />
                       <span className="text-xs font-bold text-slate-500">肩高</span>
                       <span className="font-black text-slate-800">{dog.shoulder} <span className="text-xs">cm</span></span>
                    </div>
                    <div className="p-3 flex flex-col items-center">
                       <Ruler className="w-5 h-5 text-slate-400 mb-1 rotate-90" />
                       <span className="text-xs font-bold text-slate-500">背长</span>
                       <span className="font-black text-slate-800">{dog.back} <span className="text-xs">cm</span></span>
                    </div>
                 </div>
                 {/* Care Dates */}
                 <div className="p-4 space-y-3 bg-white">
                    <div className="flex justify-between items-center bg-sky-50 border-2 border-slate-900 p-2.5 rounded-xl">
                       <div className="flex items-center gap-2"><Droplets className="w-5 h-5 text-sky-500"/><span className="font-bold text-sm text-slate-700">上次洗澡</span></div>
                       <span className="font-black text-slate-900">{dog.lastBath || '未记录'}</span>
                    </div>
                    <div className="flex justify-between items-center bg-emerald-50 border-2 border-slate-900 p-2.5 rounded-xl">
                       <div className="flex items-center gap-2"><Bug className="w-5 h-5 text-emerald-500"/><span className="font-bold text-sm text-slate-700">上次驱虫</span></div>
                       <span className="font-black text-slate-900">{dog.lastDeworm || '未记录'}</span>
                    </div>
                 </div>
                 {/* Notes */}
                 <div className="p-4 pt-0">
                    <div className="bg-slate-100 border-2 border-slate-900 p-3 rounded-xl min-h-[60px]">
                       <p className="text-sm font-bold text-slate-600 mb-1">专属备注：</p>
                       <p className="text-sm font-medium text-slate-800">{dog.notes || '暂无备注...'}</p>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* 常规备忘 Tab */}
        {activeMemoTab === 'notes' && (
          <div className="flex flex-col h-full">
            <form onSubmit={handleAddNote} className="mb-6 flex gap-2">
              <input type="text" className="flex-1 border-4 border-slate-900 bg-white rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-4 focus:ring-sky-200 shadow-[4px_4px_0_0_#0f172a]" placeholder="记录新备忘..." value={newNoteInput} onChange={e => setNewNoteInput(e.target.value)} />
              <button type="submit" className="bg-slate-900 text-white px-4 py-3 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0_0_#0f172a] active:translate-y-[4px] active:shadow-none transition-all"><Plus className="w-6 h-6" /></button>
            </form>
            <div className="space-y-4 pb-8">
              {memoNotes.length === 0 && <div className="text-center text-slate-400 font-bold mt-10">还没有记录任何备忘录哦~</div>}
              {memoNotes.map(note => (
                <div key={note.id} className="bg-yellow-100 border-4 border-slate-900 rounded-xl p-4 shadow-[4px_4px_0_0_#0f172a] relative group flex justify-between items-start">
                   <div className="flex gap-3">
                     <CheckSquare className="w-6 h-6 text-yellow-600 shrink-0"/>
                     <div>
                       <p className="font-bold text-slate-800 whitespace-pre-wrap">{note.text}</p>
                       <span className="text-[11px] font-bold text-slate-500 mt-2 block">{formatTime(note.timestamp)}</span>
                     </div>
                   </div>
                   <button onClick={() => handleDeleteNote(note.id)} className="p-1.5 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] opacity-0 group-hover:opacity-100 transition-all shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 编辑狗狗 Modal */}
      {editingDog && dogForm && (
        <div className="absolute inset-0 bg-slate-50 z-30 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
           <div className="bg-white px-4 py-3 border-b-4 border-slate-900 flex justify-between items-center shadow-sm shrink-0">
            <h2 className="font-black text-lg text-slate-800 flex items-center"><Edit3 className="w-5 h-5 mr-2"/>编辑 {dogForm.name} 档案</h2>
            <button onClick={() => setEditingDog(null)} className="p-1.5 bg-slate-100 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a]"><X className="w-4 h-4"/></button>
          </div>
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">狗狗头像 (本地上传)</label>
               <div className="flex items-center gap-3 mt-2">
                  <div className="w-16 h-16 shrink-0 bg-slate-100 border-4 border-slate-900 rounded-full overflow-hidden flex items-center justify-center">
                     {dogForm.avatar ? <img src={dogForm.avatar} className="w-full h-full object-cover"/> : <ImageIcon className="w-6 h-6 text-slate-400"/>}
                  </div>
                  <input type="file" accept="image/*" className="flex-1 w-full text-sm font-medium text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-slate-900 file:text-sm file:font-black file:bg-sky-100 file:text-slate-900 hover:file:bg-sky-200 cursor-pointer transition-all" onChange={e => handleImageUpload(e, (dataUrl) => setDogForm({...dogForm, avatar: dataUrl}))} />
               </div>
            </div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">生日</label><input type="date" className="w-full border-2 border-slate-900 rounded-lg p-3 font-medium" value={dogForm.birthday} onChange={e => setDogForm({...dogForm, birthday: e.target.value})} /></div>
            <div className="grid grid-cols-3 gap-3">
               <div><label className="block text-sm font-bold text-slate-700 mb-1">体重(kg)</label><input type="number" step="0.1" className="w-full border-2 border-slate-900 rounded-lg p-3 font-medium" value={dogForm.weight} onChange={e => setDogForm({...dogForm, weight: e.target.value})} /></div>
               <div><label className="block text-sm font-bold text-slate-700 mb-1">肩高(cm)</label><input type="number" className="w-full border-2 border-slate-900 rounded-lg p-3 font-medium" value={dogForm.shoulder} onChange={e => setDogForm({...dogForm, shoulder: e.target.value})} /></div>
               <div><label className="block text-sm font-bold text-slate-700 mb-1">背长(cm)</label><input type="number" className="w-full border-2 border-slate-900 rounded-lg p-3 font-medium" value={dogForm.back} onChange={e => setDogForm({...dogForm, back: e.target.value})} /></div>
            </div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">上次洗澡日期</label><input type="date" className="w-full border-2 border-slate-900 rounded-lg p-3 font-medium" value={dogForm.lastBath} onChange={e => setDogForm({...dogForm, lastBath: e.target.value})} /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">上次驱虫日期</label><input type="date" className="w-full border-2 border-slate-900 rounded-lg p-3 font-medium" value={dogForm.lastDeworm} onChange={e => setDogForm({...dogForm, lastDeworm: e.target.value})} /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">专属备注</label><textarea className="w-full border-2 border-slate-900 rounded-lg p-3 font-medium min-h-[100px]" value={dogForm.notes} onChange={e => setDogForm({...dogForm, notes: e.target.value})} /></div>
            <button onClick={handleSaveDog} className="w-full py-4 mt-2 bg-sky-500 text-white font-black text-lg border-4 border-slate-900 rounded-xl shadow-[4px_4px_0_0_#0f172a] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center"><Save className="w-5 h-5 mr-2"/> 保存资料</button>
          </div>
        </div>
      )}
    </div>
  );

  // --- 3. 小卖铺视图 ---
  const renderShopApp = () => (
    <div className="flex flex-col h-full relative bg-slate-50">
      {/* 商店全局 Header (带返回键) */}
      <header className="bg-white border-b-4 border-slate-900 px-4 py-4 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center">
          <button onClick={() => setCurrentApp('home')} className="p-1.5 mr-3 bg-slate-100 hover:bg-slate-200 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] transition-all"><ArrowLeft className="w-5 h-5 text-slate-800"/></button>
          <h1 className="text-xl font-black tracking-tight text-slate-900 flex items-center">
            <Store className="w-6 h-6 mr-2 text-indigo-500" strokeWidth={3} />
            小羊小卖铺
          </h1>
        </div>
        <div className="flex items-center space-x-1.5 bg-emerald-100 border-2 border-slate-900 px-3 py-1.5 rounded-full shadow-[2px_2px_0_0_#0f172a]">
          <Coins className="w-5 h-5 text-emerald-600" strokeWidth={3} />
          <span className="font-black text-emerald-800 text-sm tracking-wide">{user.points}</span>
        </div>
      </header>

      {/* 商店内容区 */}
      <main className="flex-1 overflow-hidden relative">
        {activeShopTab === 'store' && (
           <div className="flex flex-col h-full relative">
            <div className="bg-white px-4 py-3 border-b-4 border-slate-900 shadow-sm flex flex-col space-y-3 z-10 shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="font-black text-lg text-slate-800">商品分类</h2>
                <button onClick={() => { setEditProductId(null); setNewProduct({ name: '', category: '未分类', cost: '', imageUrl: '' }); setIsAddingProduct(true); }} className="flex items-center text-sm font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] active:translate-y-[2px] active:shadow-none transition-all">
                  <Plus className="w-4 h-4 mr-1"/> 上架商品
                </button>
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2 pt-1 no-scrollbar items-center">
                 {categories.map(cat => (
                    <div key={cat} className="relative group shrink-0">
                      <button onClick={() => setCurrentCategory(cat)} className={`px-4 py-1.5 rounded-full font-bold text-sm border-2 transition-all whitespace-nowrap ${currentCategory === cat ? 'bg-emerald-400 text-slate-900 border-slate-900 shadow-[2px_2px_0_0_#0f172a]' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-900 hover:text-slate-900 hover:shadow-[2px_2px_0_0_#0f172a]'}`}>{cat}</button>
                      {currentCategory === cat && !['全部', '未分类'].includes(cat) && (
                        <button onClick={(e) => { e.stopPropagation(); confirmDeleteCategory(cat); }} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 border-2 border-slate-900 z-10 hover:scale-110 transition-transform"><X className="w-3 h-3" /></button>
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
                        <button onClick={() => { setEditProductId(product.id); setNewProduct({ name: product.name, category: product.category, cost: product.cost.toString(), imageUrl: product.imageUrl || '' }); setIsAddingProduct(true); }} className="p-1.5 bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => confirmDeleteProduct(product.id)} className="p-1.5 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="w-full aspect-square border-b-4 border-slate-900 bg-slate-100 relative overflow-hidden shrink-0">
                        {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-8 h-8" /></div>}
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-black rounded border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a]">{product.category}</span>
                      </div>
                      <div className="p-3 flex flex-col flex-1 bg-white min-h-[110px]">
                        <h3 className="font-black text-slate-800 text-[15px] leading-snug break-words whitespace-normal mb-3">{product.name}</h3>
                        <div className="mt-auto pt-1 flex items-center justify-between gap-1 flex-wrap">
                          <div className="flex items-center text-indigo-600"><Coins className="w-4 h-4 mr-0.5" strokeWidth={3} /><span className="font-black text-lg leading-none">{product.cost}</span></div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleRecommend(product)} className="p-1.5 bg-indigo-50 text-indigo-600 border-2 border-slate-900 rounded-lg shadow-[2px_2px_0_0_#0f172a] hover:bg-indigo-200 active:translate-y-[2px] active:shadow-none transition-all"><ThumbsUp className="w-4 h-4" strokeWidth={2.5} /></button>
                            <button onClick={() => handleRedeem(product)} className="px-2.5 py-1.5 bg-slate-900 text-white font-black text-sm border-2 border-slate-900 rounded-lg shadow-[2px_2px_0_0_#0f172a] hover:bg-slate-800 active:translate-y-[2px] active:shadow-none transition-all whitespace-nowrap">兑换</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
      
            {/* 上架商品弹窗 */}
            {isAddingProduct && (
              <div className="absolute inset-0 bg-slate-50 z-20 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
                <div className="bg-white px-4 py-3 border-b-4 border-slate-900 flex justify-between items-center shadow-sm shrink-0">
                  <h2 className="font-black text-lg text-slate-800">{editProductId ? '修改商品' : '上架新商品'}</h2>
                  <button onClick={() => setIsAddingProduct(false)} className="p-1.5 bg-slate-100 rounded-lg border-2 border-slate-900 hover:bg-slate-200 shadow-[2px_2px_0_0_#0f172a]"><X className="w-4 h-4 text-slate-800"/></button>
                </div>
                <div className="p-5 flex-1 overflow-y-auto space-y-5">
                  <div><label className="block text-sm font-bold text-slate-700 mb-1">商品名称</label><input type="text" className="w-full border-2 border-slate-900 rounded-lg p-3 font-medium bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="输入商品名称" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-1">商品图片 (本地上传)</label>
                    <div className="flex items-center gap-3">
                       <div className="w-16 h-16 shrink-0 bg-slate-100 border-2 border-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                          {newProduct.imageUrl ? <img src={newProduct.imageUrl} className="w-full h-full object-cover"/> : <ImageIcon className="w-6 h-6 text-slate-400"/>}
                       </div>
                       <input type="file" accept="image/*" className="flex-1 w-full text-sm font-medium text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-slate-900 file:text-sm file:font-black file:bg-indigo-100 file:text-slate-900 hover:file:bg-indigo-200 cursor-pointer transition-all" onChange={e => handleImageUpload(e, (dataUrl) => setNewProduct({...newProduct, imageUrl: dataUrl}))} />
                    </div>
                  </div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-1">兑换积分</label><input type="number" className="w-full border-2 border-slate-900 rounded-lg p-3 font-medium bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100" value={newProduct.cost} onChange={e => setNewProduct({...newProduct, cost: e.target.value})} placeholder="例如: 100" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2">所属分类</label>
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
                    {editProductId ? '保存修改' : '确认上架'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeShopTab === 'community' && (
           <div className="flex flex-col h-full bg-slate-50 relative">
            <div className="bg-white px-4 py-3 border-b-4 border-slate-900 flex justify-between items-center shadow-sm z-10 shrink-0">
              <h2 className="font-black text-lg text-slate-800 tracking-tight">羊村小喇叭</h2>
              <div className="flex items-center space-x-1.5 text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-full border-2 border-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span className="text-xs">实时在线</span>
              </div>
            </div>
      
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {messages.length === 0 && <div className="text-center text-slate-400 font-bold mt-10">社区空空如也，快来发第一条消息吧！</div>}
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === user.name ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                     <span className="text-xs font-bold text-slate-600">{msg.sender}</span><span className="text-[10px] text-slate-400 font-medium">{formatTime(msg.timestamp)}</span>
                  </div>
                  {msg.type === 'system' ? (
                    <div className="bg-slate-200 border-2 border-slate-300 text-slate-700 text-sm font-bold px-4 py-2 rounded-xl text-center self-center my-2">{msg.text}</div>
                  ) : msg.type === 'recommend' ? (
                    <div className="bg-indigo-50 border-4 border-slate-900 rounded-xl p-3 max-w-[85%] shadow-[4px_4px_0_0_#0f172a]">
                      <p className="font-medium text-slate-800 text-sm mb-2">{msg.text}</p>
                      {msg.product && (
                         <div className="flex items-center bg-white border-2 border-slate-900 rounded-lg p-2 mt-2 gap-3 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => { setActiveShopTab('store'); setCurrentCategory('全部'); }}>
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
                    <div className={`border-4 border-slate-900 rounded-xl p-3 max-w-[80%] font-medium shadow-[4px_4px_0_0_#0f172a] ${msg.sender === user.name ? 'bg-emerald-400 text-slate-900 rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'}`}>{msg.text}</div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
      
            <form onSubmit={handleSendMessage} className="bg-white p-3 border-t-4 border-slate-900 flex gap-2 shrink-0 z-10">
              <input type="text" className="flex-1 border-2 border-slate-900 bg-slate-50 rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-colors" placeholder="分享你的心得..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
              <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] active:translate-y-[2px] active:shadow-none transition-all"><Send className="w-5 h-5" /></button>
            </form>
          </div>
        )}

        {activeShopTab === 'profile' && (
           <div className="flex flex-col h-full bg-slate-50 p-4 space-y-6 overflow-y-auto pb-12">
            <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 flex flex-col shadow-[4px_4px_0_0_#0f172a] relative overflow-hidden shrink-0">
              <div className="flex items-center z-10">
                <div className="w-20 h-20 rounded-full border-4 border-slate-900 bg-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-emerald-600" strokeWidth={2.5} />}
                </div>
                <div className="ml-5">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-black text-slate-800">{user.name}</h2>
                    <button onClick={() => { setProfileEdit({name: user.name, avatar: user.avatar, uid: user.id}); setIsEditingProfile(true); }} className="p-1 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded border border-transparent hover:border-indigo-200 transition-colors"><Edit3 className="w-4 h-4"/></button>
                  </div>
                  <div className="mt-2 inline-flex items-center text-emerald-600 font-black text-lg">
                      <Coins className="w-5 h-5 mr-1" strokeWidth={3} /> {user.points} 积分
                  </div>
                </div>
              </div>
              <div className="mt-5 p-3 bg-slate-100 border-2 border-slate-900 rounded-xl text-sm break-all select-all flex flex-col z-10 cursor-text">
                  <span className="font-bold text-slate-600 mb-1">云端数据标识 (UID) :</span>
                  <span className="font-mono font-bold text-slate-800">{user.id}</span>
              </div>
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-100 rounded-full border-4 border-slate-900 opacity-50 pointer-events-none"></div>
            </div>
      
            <div className="bg-indigo-100 border-4 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0_0_#0f172a] shrink-0">
              <h3 className="font-black text-lg text-slate-900 mb-4 flex items-center"><Coins className="w-5 h-5 mr-2 text-indigo-600" strokeWidth={3}/> 赚取积分</h3>
              <div className="bg-white border-2 border-slate-900 rounded-xl p-4 flex flex-col gap-3">
                 <label className="text-sm font-bold text-slate-700">充值个人专属积分</label>
                 <div className="flex gap-2">
                   <input type="number" className="flex-1 border-2 border-slate-900 rounded-lg px-3 py-2 font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100" placeholder="输入增加的数值" value={customPointsInput} onChange={e => setCustomPointsInput(e.target.value)} />
                   <button onClick={handleAddPoints} className="px-4 py-2 bg-emerald-400 text-slate-900 font-black rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] active:translate-y-[2px] active:shadow-none transition-all whitespace-nowrap">充值</button>
                 </div>
              </div>
            </div>
      
            <div className="bg-amber-100 border-4 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0_0_#0f172a] shrink-0">
              <h3 className="font-black text-lg text-slate-900 mb-4 flex items-center"><RefreshCw className="w-5 h-5 mr-2 text-amber-700" strokeWidth={3}/> 切换与找回账号</h3>
              <div className="bg-white border-2 border-slate-900 rounded-xl p-4 flex flex-col gap-3">
                 <label className="text-sm font-bold text-slate-700">输入您的完整UID以找回云端数据</label>
                 <div className="flex gap-2">
                   <input type="text" className="flex-1 border-2 border-slate-900 rounded-lg px-3 py-2 font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-100" placeholder="填入需要找回的UID" value={recoverUidInput} onChange={e => setRecoverUidInput(e.target.value)} />
                   <button onClick={handleRecoverAccount} className="px-4 py-2 bg-amber-400 text-slate-900 font-black rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] active:translate-y-[2px] active:shadow-none transition-all whitespace-nowrap">找回</button>
                 </div>
              </div>
            </div>
      
            {isEditingProfile && (
               <div className="absolute inset-0 bg-slate-50 z-30 p-6 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
                  <h2 className="text-2xl font-black text-slate-900 mb-6 shrink-0">编辑资料</h2>
                  <div className="space-y-4 flex-1 overflow-y-auto pb-4">
                     <div><label className="block text-sm font-bold text-slate-700 mb-1">专属昵称</label><input type="text" className="w-full border-4 border-slate-900 rounded-xl p-3 font-bold text-lg outline-none focus:ring-4 focus:ring-indigo-100 transition-colors" value={profileEdit.name} onChange={e => setProfileEdit({...profileEdit, name: e.target.value})} /></div>
                     <div><label className="block text-sm font-bold text-slate-700 mb-1">专属头像 (本地上传)</label>
                        <div className="flex items-center gap-3 mt-2">
                           <div className="w-16 h-16 shrink-0 bg-slate-100 border-4 border-slate-900 rounded-full overflow-hidden flex items-center justify-center">
                              {profileEdit.avatar ? <img src={profileEdit.avatar} className="w-full h-full object-cover"/> : <User className="w-6 h-6 text-slate-400"/>}
                           </div>
                           <input type="file" accept="image/*" className="flex-1 w-full text-sm font-medium text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-slate-900 file:text-sm file:font-black file:bg-emerald-100 file:text-slate-900 hover:file:bg-emerald-200 cursor-pointer transition-all" onChange={e => handleImageUpload(e, (dataUrl) => setProfileEdit({...profileEdit, avatar: dataUrl}))} />
                        </div>
                     </div>
                  </div>
                  <div className="mt-auto flex gap-3 pt-4 shrink-0 border-t-2 border-slate-200">
                     <button onClick={() => setIsEditingProfile(false)} className="flex-1 py-3 bg-white font-black text-slate-700 border-4 border-slate-900 rounded-xl shadow-[4px_4px_0_0_#0f172a] active:translate-y-[4px] active:shadow-none transition-all">取消</button>
                     <button onClick={handleSaveProfile} className="flex-1 py-3 bg-slate-900 font-black text-white border-4 border-slate-900 rounded-xl shadow-[4px_4px_0_0_#0f172a] active:translate-y-[4px] active:shadow-none transition-all">保存</button>
                  </div>
               </div>
            )}
          </div>
        )}
      </main>

      {/* 商店专有底部导航 */}
      <nav className="bg-white border-t-4 border-slate-900 flex justify-around p-3 shrink-0 z-20">
        <button onClick={() => setActiveShopTab('store')} className={`flex flex-col items-center justify-center p-2 rounded-xl w-16 transition-all ${activeShopTab === 'store' ? 'bg-slate-900 text-emerald-400 shadow-[4px_4px_0_0_#0f172a] -translate-y-1 border-2 border-slate-900' : 'text-slate-500 hover:text-slate-900 border-2 border-transparent'}`}><Store className="w-6 h-6 mb-1" strokeWidth={activeShopTab === 'store' ? 2.5 : 2} /><span className="text-[11px] font-black">商城</span></button>
        <button onClick={() => setActiveShopTab('community')} className={`flex flex-col items-center justify-center p-2 rounded-xl w-16 transition-all ${activeShopTab === 'community' ? 'bg-slate-900 text-emerald-400 shadow-[4px_4px_0_0_#0f172a] -translate-y-1 border-2 border-slate-900' : 'text-slate-500 hover:text-slate-900 border-2 border-transparent'}`}><MessageCircle className="w-6 h-6 mb-1" strokeWidth={activeShopTab === 'community' ? 2.5 : 2} /><span className="text-[11px] font-black">社区</span></button>
        <button onClick={() => setActiveShopTab('profile')} className={`flex flex-col items-center justify-center p-2 rounded-xl w-16 transition-all ${activeShopTab === 'profile' ? 'bg-slate-900 text-emerald-400 shadow-[4px_4px_0_0_#0f172a] -translate-y-1 border-2 border-slate-900' : 'text-slate-500 hover:text-slate-900 border-2 border-transparent'}`}><User className="w-6 h-6 mb-1" strokeWidth={activeShopTab === 'profile' ? 2.5 : 2} /><span className="text-[11px] font-black">我的</span></button>
      </nav>
    </div>
  );

  // ==========================================
  // 【 根 容 器 】
  // ==========================================
  return (
    <div className="h-screen w-full flex justify-center items-center bg-slate-800 font-sans sm:p-6">
      <div className="w-full h-full sm:max-w-[400px] sm:h-[800px] sm:max-h-full sm:rounded-[2rem] bg-slate-100 flex flex-col relative overflow-hidden sm:border-8 border-slate-900 sm:shadow-[16px_16px_0_0_#0f172a]">
        
        {currentApp === 'home' && renderHome()}
        {currentApp === 'shop' && renderShopApp()}
        {currentApp === 'memo' && renderMemoApp()}

        {/* 全局 Modal */}
        {modal.isOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
            <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0_0_#0f172a] rounded-2xl p-6 w-full max-w-sm flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-xl font-black text-slate-800 mb-3 flex items-center">
                {modal.onConfirm ? <AlertCircle className="w-5 h-5 mr-2 text-indigo-500" /> : null}
                {modal.title}
              </h3>
              <p className="text-slate-700 font-bold mb-6 leading-relaxed text-sm">{modal.message}</p>
              <div className="flex space-x-3 justify-end mt-auto">
                <button onClick={closeModal} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black border-2 border-slate-900 rounded-xl shadow-[2px_2px_0_0_#0f172a] active:translate-y-[2px] active:shadow-none transition-all">{modal.onConfirm ? '取消' : '知道啦'}</button>
                {modal.onConfirm && (
                  <button onClick={modal.onConfirm} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-black border-2 border-slate-900 rounded-xl shadow-[2px_2px_0_0_#0f172a] active:translate-y-[2px] active:shadow-none transition-all">确定</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}