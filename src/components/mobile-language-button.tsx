'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import LanguageSelector from './language-selector'
import { useSize } from '@/hooks/use-size'

type MobileLanguageButtonProps = {
	className?: string
	 delay?: number
}

export function MobileLanguageButton({ className, delay }: MobileLanguageButtonProps) {
	const [show, setShow] = useState(false)
	const [active, setActive] = useState(false)
	const [isInteracting, setIsInteracting] = useState(false)
	const [isListOpen, setIsListOpen] = useState(false)
	const [isFirstLoad, setIsFirstLoad] = useState(true)
	const { maxSM } = useSize()
	
	useEffect(() => {
		if (maxSM) {
			setTimeout(() => setShow(true), delay || 1000)
		} else {
			setShow(false)
		}
	}, [delay, maxSM])

	useEffect(() => {
		if (!maxSM) return
		
		let inactivityTimer: NodeJS.Timeout
		let hideCheckTimer: NodeJS.Timeout
		
		const handleScroll = () => {
			setActive(true)
			setIsInteracting(true)
			
			// 清除之前的定时器
			clearTimeout(inactivityTimer)
			clearTimeout(hideCheckTimer)
			
			// 重置交互状态
			setTimeout(() => {
				setIsInteracting(false)
			}, 500)
			
			// 设置新的定时器，3秒后隐藏按钮
			resetInactivityTimer()
		}
		
		const resetInactivityTimer = () => {
			clearTimeout(inactivityTimer)
			clearTimeout(hideCheckTimer)
			
			// 第一次加载使用5秒，后续使用3秒
			const timeout = isFirstLoad ? 5000 : 3000
			
			inactivityTimer = setTimeout(() => {
				// 第一次加载后重置标志
				setIsFirstLoad(false)
				
				// 检查是否应该隐藏按钮
				hideCheckTimer = setTimeout(() => {
					if (!isInteracting && !isListOpen) {
						setActive(false)
					}
				}, 100) // 短暂延迟，确保交互状态已更新
			}, timeout)
		}
		
		// 初始化时设置为可见
		setActive(true)
		
		// 设置初始定时器，根据是否是第一次加载使用不同时间
		resetInactivityTimer()
		
		// 添加滚动事件监听
		window.addEventListener('scroll', handleScroll, { passive: true })
		
		// 清理函数
		return () => {
			window.removeEventListener('scroll', handleScroll)
			clearTimeout(inactivityTimer)
			clearTimeout(hideCheckTimer)
		}
	}, [maxSM, isInteracting, isListOpen])

	// 监听触摸事件，标记为交互状态
	useEffect(() => {
		if (!maxSM) return
		
		const handleTouchStart = () => {
			setIsInteracting(true)
			setActive(true)
		}
		
		const handleTouchEnd = () => {
			setTimeout(() => {
				setIsInteracting(false)
			}, 500)
		}
		
		window.addEventListener('touchstart', handleTouchStart, { passive: true })
		window.addEventListener('touchend', handleTouchEnd, { passive: true })
		
		return () => {
			window.removeEventListener('touchstart', handleTouchStart)
			window.removeEventListener('touchend', handleTouchEnd)
		}
	}, [maxSM])

	if (!show || !maxSM) return null

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.4 }}
			animate={{ 
				opacity: active ? 1 : 0, 
				scale: active ? 1 : 0.8,
				transition: { duration: 0.5 } // 0.5秒渐变效果
			}}
			className={cn('z-50', className)}
			onMouseEnter={() => setIsInteracting(true)}
			onMouseLeave={() => setTimeout(() => setIsInteracting(false), 500)}
		>
			<LanguageSelector 
				direction="up" 
				mobile={true}
				onListOpen={(open) => setIsListOpen(open)}
			/>
		</motion.div>
	)
}
