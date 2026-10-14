import pygame
import numpy as np
from PIL import Image
import os
import subprocess
import random

WIDTH, HEIGHT = 320, 240
pygame.init()
screen = pygame.Surface((WIDTH, HEIGHT))

BLACK = (0, 0, 0)
BLUE = (0, 0, 170)
CYAN = (0, 170, 170)
GREEN = (0, 170, 0)
WHITE = (255, 255, 255)
RED = (170, 0, 0)
YELLOW = (255, 255, 0)
ORANGE = (255, 170, 0)
PURPLE = (170, 0, 170)

os.makedirs('frames', exist_ok=True)
random.seed(42)

def draw_opera_house(surf, t):
    surf.fill(BLUE)
    pygame.draw.polygon(surf, WHITE, [(50, 180), (100, 80), (150, 180)])
    pygame.draw.polygon(surf, WHITE, [(120, 180), (180, 60), (240, 180)])
    pygame.draw.polygon(surf, WHITE, [(200, 180), (250, 100), (290, 180)])
    pygame.draw.rect(surf, CYAN, (0, 180, WIDTH, 60))
    for i in range(5):
        x = 80 + i*40
        drip_len = int(20 + 10 * np.sin(t/10 + i))
        pygame.draw.line(surf, YELLOW, (x, 150), (x, 150 + drip_len), 3)
    kx = int(50 + (t * 2) % 200)
    pygame.draw.circle(surf, ORANGE, (kx, 50), 8)
    pygame.draw.circle(surf, ORANGE, (kx+10, 50), 6)

def draw_harbour_bridge(surf, t):
    surf.fill((0, 100, 200))
    pygame.draw.arc(surf, WHITE, (20, 100, 280, 100), 0, 3.14, 5)
    pygame.draw.rect(surf, (100,100,100), (0, 150, WIDTH, 10))
    jump_h = int(30 * abs(np.sin(t/5)))
    pygame.draw.circle(surf, ORANGE, (100 + int(t*3)%150, 120 - jump_h), 12)
    for i, col in enumerate([RED, ORANGE, YELLOW, GREEN, CYAN, BLUE, PURPLE]):
        pygame.draw.arc(surf, col, (50+i*5, 50+i*5, 200-i*10, 150-i*10), 0, 3.14, 2)
    px = (t*4) % WIDTH
    pygame.draw.circle(surf, YELLOW, (int(px), 40), 15)
    pygame.draw.circle(surf, RED, (int(px), 40), 5)

def draw_bondi(surf, t):
    surf.fill(CYAN)
    pygame.draw.rect(surf, (255,200,100), (0, 160, WIDTH, 80))
    for w in range(3):
        pygame.draw.arc(surf, BLUE, (w*100 - (t%50), 140, 100, 40), 0, 3.14, 3)
    sx = (t*2) % 250
    pygame.draw.polygon(surf, (100,100,100), [(sx, 150), (sx+20, 140), (sx+40, 155)])
    pygame.draw.rect(surf, ORANGE, (sx+10, 155, 30, 5))
    pygame.draw.circle(surf, (150,100,50), (200 + int(np.sin(t/3)*20), 130), 10)

scenes = [draw_opera_house, draw_harbour_bridge, draw_bondi, draw_opera_house, draw_harbour_bridge]
frames_per_scene = 60
total_frames = 0
for s_idx, draw_func in enumerate(scenes):
    for f in range(frames_per_scene):
        t = f
        draw_func(screen, t)
        if random.random() < 0.05:
            ex = random.randint(50, 270)
            ey = random.randint(30, 150)
            pygame.draw.circle(screen, YELLOW, (ex, ey), random.randint(5,15))
            pygame.draw.circle(screen, RED, (ex, ey), random.randint(2,8))
        pygame.image.save(screen, f'frames/frame_{total_frames:04d}.png')
        total_frames += 1

print(f"Total frames: {total_frames}")
print("Now run: ffmpeg -framerate 10 -i frames/frame_%04d.png -c:v libx264 -pix_fmt yuv420p sydney_8bit_surreal.mp4")
