export type IconsType = keyof typeof ICONS

export const ICONS = {
  select: (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 20 20"><path fill="#ffffff" d="M6 3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6ZM4 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Zm9.854 1.854a.5.5 0 0 0-.708-.708L8.5 11.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l5-5Z"/></svg>`,
  selectAll: (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 24 24"><path fill="#ffffff" d="M20.496 5.627A2.25 2.25 0 0 1 22 7.75v10A4.25 4.25 0 0 1 17.75 22h-10a2.25 2.25 0 0 1-2.123-1.504l2.097.004H17.75a2.75 2.75 0 0 0 2.75-2.75v-10l-.004-.051V5.627ZM17.246 2a2.25 2.25 0 0 1 2.25 2.25v12.997a2.25 2.25 0 0 1-2.25 2.25H4.25A2.25 2.25 0 0 1 2 17.247V4.25A2.25 2.25 0 0 1 4.25 2h12.997Zm0 1.5H4.25a.75.75 0 0 0-.75.75v12.997c0 .414.336.75.75.75h12.997a.75.75 0 0 0 .75-.75V4.25a.75.75 0 0 0-.75-.75Zm-7.665 7.858L13.47 7.47a.75.75 0 0 1 1.133.976l-.073.084l-4.5 4.5a.75.75 0 0 1-1.056.004L8.9 12.95l-1.5-2a.75.75 0 0 1 1.127-.984l.073.084l.981 1.308L13.47 7.47l-3.89 3.888Z"/></svg>`,
  'select-fill': (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 16 16"><path fill="#ffffff" d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2h-7Zm6.354 4.854l-3.5 3.5a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 9.293l3.146-3.147a.5.5 0 0 1 .708.708Z"/></svg>`,
  'selectAll-fill': (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 24 24"><path d="M20.496 5.627A2.25 2.25 0 0 1 22 7.75v10A4.25 4.25 0 0 1 17.75 22h-10a2.25 2.25 0 0 1-2.123-1.504l2.097.004H17.75a2.75 2.75 0 0 0 2.75-2.75v-10l-.004-.051V5.627zM17.246 2a2.25 2.25 0 0 1 2.25 2.25v12.997a2.25 2.25 0 0 1-2.25 2.25H4.25A2.25 2.25 0 0 1 2 17.247V4.25A2.25 2.25 0 0 1 4.25 2h12.997zM13.47 7.47L9.58 11.358L8.6 10.05a.75.75 0 1 0-1.2.9l1.5 2a.75.75 0 0 0 1.13.08l4.5-4.5a.75.75 0 0 0-1.06-1.06z" fill="#ffffff" fill-rule="nonzero"/></svg>`,
  cut: (size: number) => `<svg class='whiteIcon' xmlns="http://www.w3.org/2000/svg" height=${size} viewBox="0 -960 960 960" width=${size}><path d="M760-120 480-400l-94 94q8 15 11 32t3 34q0 66-47 113T240-80q-66 0-113-47T80-240q0-66 47-113t113-47q17 0 34 3t32 11l94-94-94-94q-15 8-32 11t-34 3q-66 0-113-47T80-720q0-66 47-113t113-47q66 0 113 47t47 113q0 17-3 34t-11 32l494 494v40H760ZM600-520l-80-80 240-240h120v40L600-520ZM240-640q33 0 56.5-23.5T320-720q0-33-23.5-56.5T240-800q-33 0-56.5 23.5T160-720q0 33 23.5 56.5T240-640Zm240 180q8 0 14-6t6-14q0-8-6-14t-14-6q-8 0-14 6t-6 14q0 8 6 14t14 6ZM240-160q33 0 56.5-23.5T320-240q0-33-23.5-56.5T240-320q-33 0-56.5 23.5T160-240q0 33 23.5 56.5T240-160Z"/></svg>`,
  paste: (size: number) => `<svg class='whiteIcon' xmlns="http://www.w3.org/2000/svg" height=${size} viewBox="0 -960 960 960" width=${size}><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560h-80v120H280v-120h-80v560Zm280-560q17 0 28.5-11.5T520-800q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800q0 17 11.5 28.5T480-760Z"/></svg>`,
  copy: (size: number) => `<svg class='whiteIcon' xmlns="http://www.w3.org/2000/svg" height=${size} viewBox="0 -960 960 960" width=${size}><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>`,
  add: (size: number) => `<svg class='whiteIcon' xmlns='http://www.w3.org/2000/svg' height=${size} width=${size} viewBox='0 -960 960 960'><path d='M450-450H200v-60h250v-250h60v250h250v60H510v250h-60v-250Z'/></svg>`,
  edit: (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 24 24"><path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0L5 16ZM15 6l3 3m-5 11h8"/></svg>`,
  rarr: (size: number) => `<svg class='whiteIcon' xmlns='http://www.w3.org/2000/svg' height=${size} width=${size} viewBox='0 -960 960 960'><path d='m560-242-43-42 168-168H160v-60h525L516-681l43-42 241 241-240 240Z'/></svg>`,
  'double-rarr': (s: number) => `<svg class='whiteIcon' xmlns="http://www.w3.org/2000/svg" height=${s} viewBox="0 -960 960 960" width=${s}><path d="M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z"/></svg>`,
  'double-larr': (s: number) => `<svg class='whiteIcon' xmlns="http://www.w3.org/2000/svg" height=${s} viewBox="0 -960 960 960" width=${s}><path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z"/></svg>`,
  larr: (size: number) => `<svg class='whiteIcon' xmlns='http://www.w3.org/2000/svg' height=${size} width=${size} viewBox='0 -960 960 960'><path d='M400-240 160-480l241-241 43 42-169 169h526v60H275l168 168-43 42Z'/></svg>`,
  'new-file': (size: number) => `<svg class='whiteIcon' xmlns="http://www.w3.org/2000/svg" height=${size} viewBox="0 -960 960 960" width=${size}><path d="M440-240h80v-120h120v-80H520v-120h-80v120H320v80h120v120ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>`,
  'new-folder': (size: number) => `<svg class='whiteIcon' xmlns="http://www.w3.org/2000/svg" height=${size} viewBox="0 -960 960 960" width=${size}><path d="M560-320h80v-80h80v-80h-80v-80h-80v80h-80v80h80v80ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/></svg>`,
  'folder-open': (size: number) => `<svg class='whiteIcon' xmlns="http://www.w3.org/2000/svg" height=${size} viewBox="0 -960 960 960" width=${size}><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Zm84-80h516l72-240H316l-72 240Zm0 0 72-240-72 240Zm-84-400v-80 80Z"/></svg>`,
  remove: (size: number) => `<svg class='whiteIcon' xmlns='http://www.w3.org/2000/svg' height=${size} width=${size} viewBox='0 -960 960 960'><path d='M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z'/>`,
  search: (size: number) => `<svg class='whiteIcon' xmlns='http://www.w3.org/2000/svg' height=${size} width=${size} viewBox='0 -960 960 960'><path d='M796-121 533-384q-30 26-69.959 40.5T378-329q-108.162 0-183.081-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l264 262-44 44ZM377-389q81.25 0 138.125-57.5T572-585q0-81-56.875-138.5T377-781q-82.083 0-139.542 57.5Q180-666 180-585t57.458 138.5Q294.917-389 377-389Z'/>`,
  'search-confirm': (size: number) => `<svg class='whiteIcon' xmlns="http://www.w3.org/2000/svg" height=${size} viewBox="0 -960 960 960" width=${size}><path d="m358-488-97-96 42-42 54 54 100-100 42 42-141 142Zm426 368L532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>`,
  terminal: (size: number) => `<svg class='whiteIcon' xmlns='http://www.w3.org/2000/svg' height=${size} width=${size} viewBox='0 -960 960 960'><path d='M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H160v400Zm140-40-56-56 103-104-104-104 57-56 160 160-160 160Zm180 0v-80h240v80H480Z'/>`,
  'sw-left': (size: number) => `<svg class='whiteIcon' xmlns='http://www.w3.org/2000/svg' height=${size} width=${size} viewBox='0 -960 960 960'><path d='M400-200 120-480l280-280v560Zm-60-145v-270L205-480l135 135Zm220 145v-560l280 280-280 280Z'/>`,
  'sw-right': (size: number) => `<svg class='whiteIcon' xmlns='http://www.w3.org/2000/svg' height=${size} width=${size} viewBox='0 -960 960 960'><path d='M400-200 120-480l280-280v560Zm160 0v-560l280 280-280 280Zm60-145 135-135-135-135v270Z'/>`,
  caret: (size: number) => `<svg class='whiteIcon' xmlns='http://www.w3.org/2000/svg' height=${size} width=${size} viewBox='0 -960 960 960'><path d='M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z'/>`,
  admin: (size: number) => `<svg class='whiteIcon' xmlns='http://www.w3.org/2000/svg' height=${size} viewBox='0 -960 960 960' width=${size}><path d='M680-280q25 0 42.5-17.5T740-340q0-25-17.5-42.5T680-400q-25 0-42.5 17.5T620-340q0 25 17.5 42.5T680-280Zm0 120q31 0 57-14.5t42-38.5q-22-13-47-20t-52-7q-27 0-52 7t-47 20q16 24 42 38.5t57 14.5ZM480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v227q-19-8-39-14.5t-41-9.5v-147l-240-90-240 90v188q0 47 12.5 94t35 89.5Q310-290 342-254t71 60q11 32 29 61t41 52q-1 0-1.5.5t-1.5.5Zm200 0q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-494Z'/>`,
  launch: (size: number) => `<svg class='whiteIcon' xmlns="http://www.w3.org/2000/svg" height=${size} viewBox="0 -960 960 960" width=${size}><path d="m226-559 78 33q14-28 29-54t33-52l-56-11-84 84Zm142 83 114 113q42-16 90-49t90-75q70-70 109.5-155.5T806-800q-72-5-158 34.5T492-656q-42 42-75 90t-49 90Zm178-65q-23-23-23-56.5t23-56.5q23-23 57-23t57 23q23 23 23 56.5T660-541q-23 23-57 23t-57-23Zm19 321 84-84-11-56q-26 18-52 32.5T532-299l33 79Zm313-653q19 121-23.5 235.5T708-419l20 99q4 20-2 39t-20 33L538-80l-84-197-171-171-197-84 167-168q14-14 33.5-20t39.5-2l99 20q104-104 218-147t235-24ZM157-321q35-35 85.5-35.5T328-322q35 35 34.5 85.5T327-151q-25 25-83.5 43T82-76q14-103 32-161.5t43-83.5Zm57 56q-10 10-20 36.5T180-175q27-4 53.5-13.5T270-208q12-12 13-29t-11-29q-12-12-29-11.5T214-265Z"/></svg>`,
  'exact-name': (size: number) => `<svg class='whiteIcon' xmlns="http://www.w3.org/2000/svg" height=${size} viewBox="0 -960 960 960" width=${size}><path d="M80 0v-160h800V0H80Zm140-280 210-560h100l210 560h-96l-50-144H368l-52 144h-96Zm176-224h168l-82-232h-4l-82 232Z"/></svg>`,
  'folder-path': (size: number) => `<svg class='whiteIcon' xmlns="http://www.w3.org/2000/svg" height=${size} viewBox="0 -960 960 960" width=${size}><path d="M600-40q-33 0-56.5-23.5T520-120q0-23 11-41t29-29v-221q-18-11-29-28.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 23-11 40.5T640-411v115l160-53v-62q-18-11-29-28.5T760-480q0-33 23.5-56.5T840-560q33 0 56.5 23.5T920-480q0 23-11 40.5T880-411v119l-240 80v22q18 11 29 29t11 41q0 33-23.5 56.5T600-40ZM160-240v-480 480Zm0 80q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480h280v80H160Z"/></svg>`,
  'resize-h': (size: number) => `<svg class='whiteIcon' xmlns="http://www.w3.org/2000/svg" height=${size} viewBox="0 -960 960 960" width=${size}><path d="M280-320 120-480l160-160 57 56-64 64h414l-63-64 56-56 160 160-160 160-56-56 63-64H273l63 64-56 56Z"/></svg>`,
  sort: (size: number) => `<svg class='whiteIcon' xmlns="http://www.w3.org/2000/svg" height=${size} viewBox="0 -960 960 960" width=${size}><path d="M480-120 300-300l58-58 122 122 122-122 58 58-180 180ZM358-598l-58-58 180-180 180 180-58 58-122-122-122 122Z"/></svg>`,
  theme: (size: number) => `<svg class='whiteIcon'xmlns="http://www.w3.org/2000/svg" height=${size} viewBox="0 -960 960 960" width=${size}><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z"/></svg>`,
  visualization: (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 16 16"><path fill="#ffffff" d="M1.001 3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V3Zm5.5 2h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1Zm-3-2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3ZM3 12.5V9h1v3.5c0 .232.052.45.146.647l3.652-3.652a1.7 1.7 0 0 1 2.404 0l3.652 3.652A1.49 1.49 0 0 0 14 12.5v-7A1.5 1.5 0 0 0 12.5 4H10V3h2.5A2.5 2.5 0 0 1 15 5.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 3 12.5Zm10.147 1.354l-3.652-3.652a.7.7 0 0 0-.99 0l-3.652 3.652c.196.094.415.146.647.146h7c.232 0 .45-.053.647-.146ZM12.5 6.502a1.002 1.002 0 1 1-2.004 0a1.002 1.002 0 0 1 2.004 0Z"/></svg>`,
  'visualization-fill': (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 16 16"><path fill="#ffffff" d="M1 3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3Zm5.5 2h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1Zm-3-2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3ZM3 12.5V9h4a3 3 0 0 0 3-3V3h2.5A2.5 2.5 0 0 1 15 5.5v7c0 .51-.152.983-.414 1.379l-4.384-4.384a1.7 1.7 0 0 0-2.404 0l-4.384 4.384A2.488 2.488 0 0 1 3 12.5Zm9.5-5.998a1.002 1.002 0 1 0-2.004 0a1.002 1.002 0 0 0 2.004 0Zm1.379 8.084l-4.384-4.384a.7.7 0 0 0-.99 0l-4.384 4.384c.396.262.87.414 1.379.414h7c.51 0 .983-.152 1.379-.414Z"/></svg>`,
  'loading-gif': (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path stroke-dasharray="60" stroke-dashoffset="60" stroke-opacity=".3" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="1.3s" values="60;0"/></path><path stroke-dasharray="15" stroke-dashoffset="15" d="M12 3C16.9706 3 21 7.02944 21 12"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="15;0"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></g></svg>`,
  'copy-path': (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 256 256"><path fill="currentColor" d="M200 168a32.06 32.06 0 0 0-31 24H72a32 32 0 0 1 0-64h96a40 40 0 0 0 0-80H72a8 8 0 0 0 0 16h96a24 24 0 0 1 0 48H72a48 48 0 0 0 0 96h97a32 32 0 1 0 31-40Zm0 48a16 16 0 1 1 16-16a16 16 0 0 1-16 16Z"/></svg>`,
  filter: (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 32 32"><path fill="currentColor" d="M26 6H4v3.17l7.41 7.42l.59.58V26h4v-2h2v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-8l-7.41-7.41A2 2 0 0 1 2 9.17V6a2 2 0 0 1 2-2h22Z"/><path fill="currentColor" d="m29.71 11.29l-3-3a1 1 0 0 0-1.42 0L16 17.59V22h4.41l9.3-9.29a1 1 0 0 0 0-1.42ZM19.59 20H18v-1.59l5-5L24.59 15ZM26 13.59L24.41 12L26 10.41L27.59 12Z"/></svg>`,
  files: (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 24 24"><path fill="currentColor" d="M4 23q-.825 0-1.413-.588T2 21V7h2v14h11v2H4Zm4-4q-.825 0-1.413-.588T6 17V3q0-.825.588-1.413T8 1h7l6 6v10q0 .825-.588 1.413T19 19H8Zm6-11h5l-5-5v5Z"/></svg>`,
  'search-off': (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 24 24"><path fill="currentColor" d="M7 20.615q-1.671 0-2.836-1.164T3 16.615q0-1.67 1.164-2.835T7 12.615q1.671 0 2.836 1.165T11 16.615q0 1.672-1.164 2.836Q8.67 20.615 7 20.615Zm13.446-.461l-6.284-6.285q-.27.231-.645.443q-.375.211-.702.326q-.107-.21-.233-.412q-.126-.203-.259-.368q1.258-.523 2.083-1.668q.825-1.144.825-2.69q0-1.971-1.38-3.35q-1.38-1.38-3.351-1.38T7.149 6.15q-1.38 1.379-1.38 3.35q0 .304.051.614q.051.311.115.596q-.22.011-.488.094t-.482.167q-.088-.313-.142-.694q-.054-.38-.054-.777q0-2.398 1.667-4.064T10.5 3.769q2.398 0 4.064 1.667T16.231 9.5q0 1.075-.376 2.028q-.376.953-.957 1.657l6.256 6.261l-.708.708ZM5.244 18.917L7 17.162l1.75 1.755l.552-.546l-1.756-1.756l1.756-1.755l-.546-.547L7 16.07l-1.756-1.756l-.546.547l1.756 1.755l-1.756 1.756l.546.546Z"/></svg>`,
  rocket: (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 24 24"><path fill="currentColor" d="m5.188 11.217l2.45 1.037q.466-.93 1.014-1.802q.548-.871 1.21-1.694l-1.535-.295q-.154-.038-.298.01t-.26.164zm3.243 1.671l2.83 2.825q1.185-.534 2.385-1.36t2.308-1.932q1.615-1.615 2.468-3.445q.853-1.83.959-4.226q-2.396.106-4.22.959q-1.823.853-3.438 2.468q-1.108 1.108-1.933 2.317q-.825 1.21-1.36 2.394m5.182-2.375q-.44-.44-.44-1.056t.44-1.057q.44-.44 1.069-.44t1.069.44q.44.44.44 1.057t-.44 1.056q-.44.44-1.07.44t-1.068-.44m-.699 8.449l2.581-2.581q.116-.116.164-.26t.01-.298l-.295-1.535q-.823.662-1.694 1.207t-1.802 1.01zm7.402-15.133q.168 2.756-.78 5.07q-.947 2.314-2.95 4.318l-.173.173l-.174.173l.404 2.052q.081.404-.03.783q-.112.379-.404.671l-3.643 3.623l-1.657-3.905l-3.564-3.564l-3.906-1.677l3.618-3.623q.292-.292.674-.413q.382-.122.785-.04l2.09.422q.097-.096.164-.173t.164-.173q2.004-2.004 4.315-2.944q2.312-.94 5.067-.773M5.117 16.167q.587-.586 1.426-.58q.84.007 1.426.594q.587.586.584 1.426q-.003.84-.59 1.426q-.51.51-1.635.873q-1.126.363-2.605.502q.139-1.48.512-2.605q.373-1.126.882-1.636m.714.727q-.289.289-.539.942q-.25.652-.33 1.347q.694-.081 1.347-.338t.941-.545q.3-.3.306-.715q.006-.416-.294-.716t-.716-.287q-.415.012-.715.312"/></svg>`,
  'rocket-fill': (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 24 24"><path fill="currentColor" d="m3.7 11.287l3.623-3.624q.292-.292.671-.413t.783-.04l1.415.294Q9.073 8.874 8.365 9.98q-.707 1.107-1.413 2.688zm4.125 1.62q.652-1.51 1.563-2.89q.91-1.379 2.08-2.548q1.872-1.873 4.072-2.806q2.2-.934 4.747-.798q.136 2.547-.795 4.747q-.93 2.2-2.804 4.073q-1.163 1.163-2.548 2.07q-1.384.907-2.896 1.558zm6.17-2.769q.44.44 1.066.44q.626 0 1.066-.44q.44-.44.44-1.056t-.44-1.057q-.44-.44-1.066-.44q-.626 0-1.067.44q-.44.44-.44 1.057t.44 1.056m-1.161 10.314L11.444 17.2q1.581-.706 2.692-1.423q1.11-.717 2.48-1.837l.288 1.416q.08.404-.03.785q-.112.382-.405.674zm-7.687-4.306q.587-.586 1.423-.58q.837.007 1.423.594q.587.586.587 1.423q0 .836-.587 1.423q-.51.51-1.635.873q-1.126.363-2.605.502q.138-1.48.511-2.602q.374-1.123.883-1.633"/></svg>`
}
