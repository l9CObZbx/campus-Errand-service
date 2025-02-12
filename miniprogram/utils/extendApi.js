/**
 * @description 消息提示框
 * @param { Object } options 参数和 wx.showToast() 参数保持一致
 */
const toast = (options = {}) => {
	const defaultOption = {
		title: '数据加载中...',
		icon: 'none',
		duration: 2000,
		mask: true
	}
	const assignOptions = Object.assign({}, defaultOption, options)
	wx.showToast({
		...assignOptions
	})
}

/**
 * @description 模态对话框
 * @param { Object } options 参数和 wx.showModal() 参数保持一致
 */
const modal = (options = {}) => {
	const defaultOption = {
		title: '提示',
		content: '您确定执行该操作吗？',
		confirmColor: '#f3514f'
	}
	const assignOptions = Object.assign({}, defaultOption, options)
	// 返回Promise的结果
	return new Promise((resolve) => {
		wx.showModal({
			...assignOptions,
			// 选中哪个走哪个
			complete({ confirm, cancel }) {
				confirm && resolve(true)
				cancel && resolve(false)
			}
		})
	})
}

export { toast, modal }