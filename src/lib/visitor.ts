/**
 * Visitor identification and local like tracking
 * Ensures every visitor is uniquely tracked to prevent duplicate likes
 */

export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'server_visitor';
  let visitorId = localStorage.getItem('dj_emma_visitor_id');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem('dj_emma_visitor_id', visitorId);
  }
  return visitorId;
}

export function getVisitorLikedIds(storageKey: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch {
    return [];
  }
}

export function isItemLikedByVisitor(storageKey: string, id: string): boolean {
  const list = getVisitorLikedIds(storageKey);
  return list.includes(id);
}

export function toggleVisitorLikedId(storageKey: string, id: string, forceState?: boolean): boolean {
  if (typeof window === 'undefined') return false;
  const list = getVisitorLikedIds(storageKey);
  const index = list.indexOf(id);
  let nowLiked = false;

  if (forceState !== undefined) {
    nowLiked = forceState;
    if (forceState && index === -1) {
      list.push(id);
    } else if (!forceState && index > -1) {
      list.splice(index, 1);
    }
  } else {
    if (index > -1) {
      list.splice(index, 1);
      nowLiked = false;
    } else {
      list.push(id);
      nowLiked = true;
    }
  }

  localStorage.setItem(storageKey, JSON.stringify(list));
  return nowLiked;
}
