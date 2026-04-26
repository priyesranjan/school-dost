import express from 'express';
import authRoutes from '../routes/auth.routes.js';
const app = express();
app.use('/api/auth', authRoutes);
function print (path: string[], layer: any) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    console.log('%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'))
  }
}
function split (thing: any) {
  if (typeof thing === 'string') return thing.split('/')
  if (thing.fast_slash) return ''
  var match = thing.toString().replace('\\/?', '').replace('(?=\\/|$)', '').match(/^\/\^\\\/([^\\]+)\\\//)
  return match ? match[1].replace(/\\/g, '') : thing.toString()
}
app._router.stack.forEach(print.bind(null, []));
