import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  if (req.method !== 'GET') return res.status(405).end()

  try {
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString()
    const last30Days = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString()
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1).toISOString()

    const [
      { data: totalSalesData },
      { data: thisMonthSalesData },
      { data: lastMonthSalesData },
      { data: totalOrdersData },
      { data: newCustomersData },
      { data: recentOrdersData },
      { data: lowStockData },
      { data: monthlyRevenueData }
    ] = await Promise.all([
      supabaseAdmin.from('orders').select('total_amount').eq('payment_status', 'paid'),
      supabaseAdmin.from('orders').select('total_amount').eq('payment_status', 'paid').gte('created_at', thisMonthStart),
      supabaseAdmin.from('orders').select('total_amount').eq('payment_status', 'paid').gte('created_at', lastMonthStart).lte('created_at', lastMonthEnd),
      supabaseAdmin.from('orders').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('site_users').select('id', { count: 'exact' }).gte('created_at', last30Days),
      supabaseAdmin.from('orders').select('id, order_number, user_code, customer_name, total_amount, payment_status, order_status, created_at').order('created_at', { ascending: false }).limit(10),
      supabaseAdmin.from('products').select('id, name, stock, low_stock_threshold').lte('stock', 10).limit(10),
      supabaseAdmin.from('orders').select('created_at, total_amount').eq('payment_status', 'paid').gte('created_at', oneYearAgo)
    ])

    const totalSales = totalSalesData?.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0) || 0
    const thisMonthRevenue = thisMonthSalesData?.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0) || 0
    const lastMonthRevenue = lastMonthSalesData?.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0) || 0
    const totalOrders = totalOrdersData?.length || 0
    const newCustomers = newCustomersData?.length || 0

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const chartData = months.map((label, i) => {
      const monthOrders = monthlyRevenueData?.filter(o => {
        const d = new Date(o.created_at)
        return d.getMonth() === i && d.getFullYear() === now.getFullYear()
      }) || []
      const revenue = monthOrders.reduce((acc, o) => acc + Number(o.total_amount || 0), 0)
      return { label, revenue }
    })

    const recentOrders = recentOrdersData?.map(o => ({
      id: o.id,
      order_number: o.order_number,
      user_code: o.user_code,
      customer_name: o.customer_name,
      total_amount: o.total_amount,
      payment_status: o.payment_status,
      order_status: o.order_status,
      created_at: o.created_at
    })) || []

    const lowStockProducts = lowStockData?.map(p => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      low_stock_threshold: p.low_stock_threshold
    })) || []

    const monthlyRevenue = chartData.map(d => ({ month: d.label, revenue: d.revenue }))
    const revenueChange = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

    return res.status(200).json({
      stats: {
        totalSales,
        totalOrders,
        thisMonthSales: thisMonthRevenue,
        revenueChange,
        newCustomers
      },
      recentOrders,
      lowStockAlerts: lowStockProducts,
      chartData: monthlyRevenue
    })
  } catch (err) {
    return serverError(res, err)
  }
}
