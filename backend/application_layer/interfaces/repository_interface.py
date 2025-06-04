from abc import ABC, abstractmethod
from typing import Optional, Dict, List

class IRepository(ABC):
    @abstractmethod
    def get(self, id: str) -> Optional[Dict]:
        pass

    @abstractmethod
    def create(self, data: Dict) -> int:
        pass

    @abstractmethod
    def update(self, id: str, data: Dict):
        pass

    @abstractmethod
    def delete(self, id: str):
        pass